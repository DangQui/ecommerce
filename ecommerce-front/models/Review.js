import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Liên kết với Product
    user: { type: String, required: true }, // Email hoặc tên người dùng (có thể thay đổi tùy theo logic xác thực của bạn)
    rating: { type: Number, required: true, min: 1, max: 5 }, // Điểm đánh giá (1-5)
    title: { type: String, required: true }, // Tiêu đề đánh giá
    content: { type: String, required: true }, // Nội dung đánh giá
    createdAt: { type: Date, default: Date.now }, // Thời gian tạo
});

export const Review = models.Review || model('Review', ReviewSchema);