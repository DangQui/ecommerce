import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import CustomerUser from "@/models/CustomerUser";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'POST') {
        const { productId, user, rating, title, content } = req.body;

        // Kiểm tra xem user (email) có tồn tại trong CustomerUser không
        const customer = await CustomerUser.findOne({ email: user });
        if (!customer) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }

        try {
            const review = new Review({
                product: productId,
                user,
                rating,
                title,
                content,
            });
            await review.save();

            res.status(200).json({ message: 'Đánh giá đã được thêm thành công' });
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi thêm đánh giá' });
        }
    } else {
        res.status(405).json({ error: 'Phương thức không được hỗ trợ' });
    }
}