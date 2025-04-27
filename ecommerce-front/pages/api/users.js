import { mongooseConnect } from "@/lib/mongoose";
import CustomerUser from "@/models/CustomerUser";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'GET') {
        const { email } = req.query;

        try {
            const user = await CustomerUser.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' });
            }
            res.status(200).json({ fullName: user.fullName, email: user.email });
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy thông tin người dùng' });
        }
    } else {
        res.status(405).json({ error: 'Phương thức không được hỗ trợ' });
    }
}