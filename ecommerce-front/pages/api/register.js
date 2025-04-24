import { mongooseConnect } from '../../lib/mongoose';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import CustomerUser from '../../models/CustomerUser';
import TempUser from '../../models/TempUser';

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

    const { fullName, email, phone, birthDate, password } = req.body;

    try {
        await mongooseConnect();

        // Kiểm tra xem email hoặc số điện thoại đã tồn tại trong collection CustomerUsers chưa
        const existingUser = await CustomerUser.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Email hoặc số điện thoại đã được sử dụng' });
        }

        // Kiểm tra xem email đã tồn tại trong collection TempUsers chưa
        const existingTempUser = await TempUser.findOne({ email });
        if (existingTempUser) {
            await TempUser.deleteOne({ email }); // Xóa bản ghi cũ nếu tồn tại
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Gửi email xác thực
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mã Xác Thực Đăng Ký Tài Khoản',
            html: `
                <h2>Xin chào ${fullName},</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản!</p>
                <p>Mã xác thực của bạn là: <strong>${verificationCode}</strong></p>
                <p>Mã này có hiệu lực trong 3 phút. Vui lòng nhập mã vào trang xác thực để hoàn tất đăng ký.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ của chúng tôi</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        // Lưu thông tin người dùng tạm thời vào TempUsers
        const tempUser = new TempUser({
            fullName,
            email,
            phone,
            birthDate,
            password: hashedPassword,
            createdAt: Date.now(),
        });
        await tempUser.save();

        // Lưu mã xác thực
        global.tempCodes = global.tempCodes || {};
        global.tempCodes[email] = {
            code: verificationCode,
            createdAt: Date.now(),
        };

        res.status(200).json({ message: 'Mã xác thực đã được gửi đến email của bạn', email });
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).json({ error: 'Lỗi máy chủ, không thể gửi mã xác thực, vui lòng thử lại sau' });
    }
}