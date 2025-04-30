import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose, { Schema, model, models } from "mongoose";

// Định nghĩa model Setting trực tiếp tại đây (hoặc import nếu đã định nghĩa ở nơi khác)
const SettingSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    priceShip: { type: String, required: true },
});

const Setting = models?.Setting || model("Setting", SettingSchema);

export default async function handle(req, res) {
    await mongooseConnect();
    const ids = req.body.ids;

    // Lấy thông tin sản phẩm
    const products = await Product.find({ _id: ids });

    // Lấy thông tin phí vận chuyển từ collection settings
    const settings = await Setting.find();

    // Kết hợp phí vận chuyển với sản phẩm
    const productsWithShipping = products.map(product => {
        const setting = settings.find(s => s.id === product._id.toString());
        return {
            ...product._doc, // Giữ nguyên thông tin sản phẩm
            priceShip: setting ? parseInt(setting.priceShip.replace(/\./g, "")) : 0 // Thêm phí vận chuyển, mặc định là 0 nếu không có
        };
    });

    res.json(productsWithShipping);
}