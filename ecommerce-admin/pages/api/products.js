import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method, query } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  try {
    if (method === "GET") {
      if (query?.id) {
        const product = await Product.findOne({ _id: query.id });
        if (!product) {
          return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
        }
        return res.json(product);
      }
      const products = await Product.find();
      return res.json(products);
    }

    if (method === "POST") {
      const { title, description, price, images, category, properties } = req.body;
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category: category || null, // Đảm bảo category có thể là null nếu không được chọn
        properties,
      });
      return res.json(productDoc);
    }

    if (method === "PUT") {
      const { title, description, price, images, category, properties, _id } = req.body;
      const product = await Product.updateOne(
        { _id },
        {
          title,
          description,
          price,
          images,
          category: category || null,
          properties,
        }
      );
      if (product.matchedCount === 0) {
        return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
      }
      return res.json(true);
    }

    if (method === "DELETE") {
      if (!query?.id) {
        return res.status(400).json({ error: "Yêu cầu ID sản phẩm" });
      }
      const product = await Product.deleteOne({ _id: query.id });
      if (product.deletedCount === 0) {
        return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
      }
      return res.json({ message: "Xóa sản phẩm thành công" });
    }

    return res.status(405).json({ error: "Phương thức không được hỗ trợ" });
  } catch (error) {
    console.error("Lỗi API:", error);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
}