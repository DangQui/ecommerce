import { mongooseConnect } from '../../lib/mongoose';
import bcrypt from 'bcryptjs';
import CustomerUser from '../../models/CustomerUser';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Phương thức không được phép' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email và mật khẩu không được để trống' });
    }

    try {
        await mongooseConnect();

        const user = await CustomerUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Mật khẩu đã được cập nhật' });
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        return res.status(500).json({ error: 'Có lỗi xảy ra, vui lòng thử lại' });
    }
}