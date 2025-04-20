import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
    try {
        await mongooseConnect();

        const { method } = req;

        if (method === "GET") {
            const admins = await Admin.find().sort({ createdAt: -1 });
            res.json(admins);
        }

        if (method === "POST") {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Email không được để trống" });
            }

            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ error: "Email đã tồn tại" });
            }

            const newAdmin = await Admin.create({ email });
            res.json(newAdmin);
        }

        if (method === "DELETE") {
            const { id } = req.query;

            const adminToDelete = await Admin.findById(id);
            if (!adminToDelete) {
                return res.status(404).json({ error: "Admin không tồn tại" });
            }

            if (adminToDelete.email === "dangdinhqui2001@gmail.com") {
                return res.status(403).json({ error: "Không thể xóa email gốc" });
            }

            await Admin.findByIdAndDelete(id);
            res.json({ success: true });
        }
    } catch (error) {
        console.error("Lỗi API:", error); // Log lỗi chi tiết
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
}