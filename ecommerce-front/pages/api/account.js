import { mongooseConnect } from '../../lib/mongoose';
import bcrypt from 'bcryptjs';
import CustomerUser from '../../models/CustomerUser';

export default async function handler(req, res) {
    try {
        await mongooseConnect();

        // Lấy email từ header (không hard-code)
        const userEmail = req.headers['user-email'];
        if (!userEmail) {
            return res.status(400).json({ error: 'Thiếu email người dùng trong header' });
        }

        const user = await CustomerUser.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        if (req.method === 'GET') {
            res.status(200).json({
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                birthDate: user.birthDate,
                twoFactorEnabled: user.twoFactorEnabled,
            });
        } else if (req.method === 'PUT') {
            const { type, ...data } = req.body;

            if (type === 'info') {
                const { fullName, email, phone, birthDate } = data;

                const existingUser = await CustomerUser.findOne({
                    $or: [{ email }, { phone }],
                    _id: { $ne: user._id },
                });
                if (existingUser) {
                    return res.status(400).json({ error: 'Email hoặc số điện thoại đã được sử dụng' });
                }

                user.fullName = fullName;
                user.email = email;
                user.phone = phone;
                user.birthDate = birthDate;
                await user.save();

                res.status(200).json({ message: 'Cập nhật thông tin thành công' });
            } else if (type === 'password') {
                const { oldPassword, newPassword } = data;

                const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });
                }

                user.password = await bcrypt.hash(newPassword, 10);
                await user.save();

                res.status(200).json({ message: 'Thay đổi mật khẩu thành công' });
            } else if (type === 'toggle2FA') {
                const { twoFactorEnabled } = data;
                user.twoFactorEnabled = twoFactorEnabled;
                await user.save();

                res.status(200).json({ message: `Xác thực 2 bước đã được ${twoFactorEnabled ? 'bật' : 'tắt'}` });
            } else {
                res.status(400).json({ error: 'Yêu cầu không hợp lệ' });
            }
        } else {
            res.status(405).json({ error: 'Phương thức không được phép' });
        }
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại sau' });
    }
}