import { mongooseConnect } from '../../lib/mongoose';
import CustomerUser from '../../models/CustomerUser';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async function handler(req, res) {
    console.log('API /api/forgot-password called');

    if (req.method !== 'POST') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Phương thức không được phép' });
    }

    const { emailOrPhone } = req.body;
    console.log('Request body:', { emailOrPhone });

    if (!emailOrPhone) {
        console.log('Email or phone is empty');
        return res.status(400).json({ error: 'Email hoặc số điện thoại không được để trống' });
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongooseConnect();
        console.log('MongoDB connected');

        console.log('Querying user with emailOrPhone:', emailOrPhone);
        const user = await CustomerUser.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) {
            console.log('User not found for emailOrPhone:', emailOrPhone);
            return res.status(404).json({ error: 'Email hoặc số điện thoại không tồn tại' });
        }
        console.log('User found:', user);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated verification code:', verificationCode);

        const mailOptions = {
            from: `QuisK Shop <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Mã Xác Thực Đặt Lại Mật Khẩu',
            html: `
                <h2>Xin chào ${user.fullName},</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
                <p>Mã xác thực của bạn là: <strong>${verificationCode}</strong></p>
                <p>Mã này có hiệu lực trong 3 phút. Vui lòng nhập mã để tiếp tục quá trình đặt lại mật khẩu.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ QuisK Shop</p>
            `,
        };

        console.log('Sending email to:', user.email);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        global.tempCodes = global.tempCodes || {};
        global.tempCodes[user.email] = {
            code: verificationCode,
            createdAt: Date.now(),
        };
        console.log('Stored verification code for email:', user.email);

        return res.status(200).json({ email: user.email });
    } catch (error) {
        console.error('Error in /api/forgot-password:', error);
        return res.status(500).json({ error: 'Có lỗi xảy ra, vui lòng thử lại' });
    }
}