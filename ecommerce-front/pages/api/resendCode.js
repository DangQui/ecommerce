import { mongooseConnect } from '../../lib/mongoose';
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

    const { email, type } = req.body;

    if (!email || !type || !['2fa-login', 'registration'].includes(type)) {
        return res.status(400).json({ error: 'Email hoặc loại xác thực không hợp lệ' });
    }

    try {
        await mongooseConnect();

        // Tạo mã xác thực mới
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        let fullName = '';

        // Xác định thông tin người dùng dựa trên type
        if (type === '2fa-login') {
            const user = await CustomerUser.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Người dùng không tồn tại' });
            }
            fullName = user.fullName;
        } else if (type === 'registration') {
            const tempUser = await TempUser.findOne({ email });
            if (!tempUser) {
                return res.status(400).json({ error: 'Thông tin người dùng tạm thời không tồn tại' });
            }
            fullName = tempUser.fullName;
        }

        // Gửi email với mã xác thực mới
        const mailOptions = {
            from: `QuisK Shop <${process.env.EMAIL_USER}>`,
            to: email,
            subject: type === '2fa-login' ? 'Mã Xác Thực Đăng Nhập Mới' : 'Mã Xác Thực Đăng Ký Tài Khoản Mới',
            html: `
                <h2>Xin chào ${fullName},</h2>
                <p>Bạn đã yêu cầu gửi lại mã xác thực.</p>
                <p>Mã xác thực mới của bạn là: <strong>${verificationCode}</strong></p>
                <p>Mã này có hiệu lực trong 3 phút. Vui lòng nhập mã để hoàn tất quá trình.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ QuisK Shop</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        // Cập nhật mã xác thực trong global.tempCodes
        global.tempCodes = global.tempCodes || {};
        global.tempCodes[email] = {
            code: verificationCode,
            createdAt: Date.now(),
        };

        res.status(200).json({ message: 'Mã xác thực mới đã được gửi đến email của bạn' });
    } catch (error) {
        console.error('Lỗi khi gửi lại mã xác thực:', error);
        res.status(500).json({ error: 'Lỗi máy chủ, không thể gửi mã xác thực, vui lòng thử lại sau' });
    }
}