import { mongooseConnect } from "@/lib/mongoose";
import { Setting } from "@/models/Setting";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    await mongooseConnect();

    const { method } = req;

    if (method === "GET") {
        // Lấy tất cả cài đặt
        const settings = await Setting.find();
        const products = await Product.find({}, { _id: 1, title: 1 }); // Lấy danh sách sản phẩm

        // Kết hợp sản phẩm với giá vận chuyển
        const productsWithPriceShip = products.map((product) => {
            const setting = settings.find((s) => s.id === product._id.toString());
            return {
                id: product._id,
                name: product.title,
                priceShip: setting ? setting.priceShip : "", // Giá vận chuyển nếu có
            };
        });

        res.json({
            products: productsWithPriceShip,
        });
    }

    if (method === "POST") {
        const { id, name, priceShip } = req.body; // Nhận dữ liệu từ client
        const existingSetting = await Setting.findOne({ id });

        if (existingSetting) {
            // Cập nhật nếu đã tồn tại
            existingSetting.name = name;
            existingSetting.priceShip = priceShip;
            await existingSetting.save();
        } else {
            // Tạo mới nếu chưa tồn tại
            await Setting.create({ id, name, priceShip });
        }

        res.json({ success: true });
    }
}