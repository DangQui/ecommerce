import mongoose, { model, models, Schema } from "mongoose";
import { Category } from "./Category";

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images: [{type: String}],
    category: {type: mongoose.Schema.Types.ObjectId, ref:'Category'},
    properties: {type: Object},
});

export const Product = models.Product || model('Product', ProductSchema);