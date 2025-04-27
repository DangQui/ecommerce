import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import CustomerUser from "@/models/CustomerUser";

export default async function handler(req, res) {
    await mongooseConnect();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const reviews = await Review.find({ product: id }).sort({ createdAt: -1 });

            // Lấy thông tin người dùng cho mỗi đánh giá
            const reviewsWithUser = await Promise.all(
                reviews.map(async (review) => {
                    const user = await CustomerUser.findOne({ email: review.user });
                    return {
                        ...review._doc,
                        userFullName: user ? user.fullName : 'Người dùng ẩn danh',
                    };
                })
            );

            res.status(200).json(reviewsWithUser);
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy đánh giá' });
        }
    } else {
        res.status(405).json({ error: 'Phương thức không được hỗ trợ' });
    }
}