import { mongooseConnect } from '../../lib/mongoose';
import CustomerUser from '../../models/CustomerUser';
import TempUser from '../../models/TempUser';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Phương thức không được phép' });
    }

    const { email, code, type } = req.body;

    if (!type || !['2fa-login', 'registration'].includes(type)) {
        return res.status(400).json({ error: 'Loại xác thực không hợp lệ' });
    }

    try {
        await mongooseConnect();

        // Kiểm tra mã xác thực
        if (!global.tempCodes || !global.tempCodes[email]) {
            return res.status(400).json({ error: 'Mã xác thực không tồn tại' });
        }

        const storedCode = global.tempCodes[email];
        const now = Date.now();
        const codeAge = now - storedCode.createdAt;

        if (codeAge > 3 * 60 * 1000) { // 3 phút
            delete global.tempCodes[email];
            if (type === 'registration') {
                await TempUser.deleteOne({ email });
            }
            return res.status(400).json({ error: 'Mã xác thực đã hết hạn' });
        }

        if (storedCode.code !== code) {
            return res.status(400).json({ error: 'Mã xác thực không đúng' });
        }

        // Xử lý theo loại xác thực
        if (type === '2fa-login') {
            // Xác thực 2FA khi đăng nhập
            const user = await CustomerUser.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Người dùng không tồn tại' });
            }

            // Xóa mã xác thực sau khi xác thực thành công
            delete global.tempCodes[email];

            res.status(200).json({ message: 'Xác thực 2FA thành công!' });
        } else if (type === 'registration') {
            // Xác thực khi đăng ký
            const tempUser = await TempUser.findOne({ email });
            if (!tempUser) {
                return res.status(400).json({ error: 'Thông tin người dùng không tồn tại' });
            }

            // Lưu người dùng vào collection CustomerUsers
            const customerUser = new CustomerUser({
                fullName: tempUser.fullName,
                email: tempUser.email,
                phone: tempUser.phone,
                birthDate: tempUser.birthDate,
                password: tempUser.password,
                isVerified: true,
                twoFactorEnabled: false,
                createdAt: Date.now(),
            });
            await customerUser.save();

            // Xóa thông tin tạm
            await TempUser.deleteOne({ email });
            delete global.tempCodes[email];

            res.status(200).json({ message: 'Xác thực thành công! Tài khoản đã được tạo.' });
        }
    } catch (error) {
        console.error('Lỗi khi xác thực:', error);
        res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại sau' });
    }
}