import { mongooseConnect } from '../../lib/mongoose';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import CustomerUser from '../../models/CustomerUser';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Phương thức không được phép' });
    }

    const { emailOrPhone, password } = req.body;

    try {
        await mongooseConnect();

        const user = await CustomerUser.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) {
            return res.status(400).json({ error: 'Email hoặc số điện thoại không tồn tại' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: 'Tài khoản chưa được xác thực' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Mật khẩu không đúng' });
        }

        if (user.twoFactorEnabled) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Mã Xác Thực Đăng Nhập',
                html: `
                    <h2>Xin chào ${user.fullName},</h2>
                    <p>Bạn vừa đăng nhập vào tài khoản của mình.</p>
                    <p>Mã xác thực của bạn là: <strong>${verificationCode}</strong></p>
                    <p>Mã này có hiệu lực trong 3 phút. Vui lòng nhập mã để hoàn tất đăng nhập.</p>
                    <p>Nếu bạn không thực hiện đăng nhập này, vui lòng bỏ qua email này.</p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ của chúng tôi</p>
                `,
            };

            await transporter.sendMail(mailOptions);

            global.tempCodes = global.tempCodes || {};
            global.tempCodes[user.email] = {
                code: verificationCode,
                createdAt: Date.now(),
            };

            res.status(200).json({ message: 'Vui lòng nhập mã xác thực 2FA', requires2FA: true, email: user.email });
        } else {
            res.status(200).json({ message: 'Đăng nhập thành công', requires2FA: false, email: user.email });
        }
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}