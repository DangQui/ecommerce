import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        const {name, parentCategory, properties} = req.body;
        const categoryDoc = await Category.create({
            name, 
            parent: parentCategory || undefined,
            properties: properties,
        });
        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        console.log("Received data:", req.body); // Log dữ liệu nhận được
        const { name, parentCategory, properties, _id } = req.body;
        const categoryDoc = await Category.findById(_id);
        if (categoryDoc) {
            categoryDoc.name = name;
            categoryDoc.properties = properties;
            categoryDoc.parent = parentCategory ? parentCategory : null;
            await categoryDoc.save();
            res.json(categoryDoc);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id: _id});
        res.json('ok');
    }
}