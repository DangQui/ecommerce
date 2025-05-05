import { mongooseConnect } from "@/lib/mongoose";
import CustomerUser from "@/models/CustomerUser"; // Import model CustomerUser từ ecommerce-front

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'GET') {
        try {
            // Lấy tất cả người dùng từ bảng customerusers
            const users = await CustomerUser.find().sort({ createdAt: -1 });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách người dùng' });
        }
    } else if (req.method === 'PUT') {
        const { userId, isDisabled } = req.body;

        try {
            // Cập nhật trạng thái vô hiệu hóa của người dùng
            const user = await CustomerUser.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Người dùng không tồn tại' });
            }

            user.isDisabled = isDisabled;
            await user.save();

            res.status(200).json({ message: `Đã ${isDisabled ? 'vô hiệu hóa' : 'bỏ vô hiệu hóa'} tài khoản thành công` });
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật trạng thái người dùng' });
        }
    } else {
        res.status(405).json({ error: 'Phương thức không được hỗ trợ' });
    }
}