import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    await mongooseConnect();
    const { search } = req.query;

    if (search) {
        const products = await Product.find({
            title: { $regex: search, $options: "i" } // Tìm kiếm không phân biệt hoa thường
        });
        res.json(products);
    } else {
        const products = await Product.find();
        res.json(products);
    }
}