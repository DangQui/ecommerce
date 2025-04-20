import mongoose, { Schema, model, models } from "mongoose";

const SettingSchema = new Schema({
    id: { type: String, required: true, unique: true }, // ID của sản phẩm
    name: { type: String, required: true }, // Tên của sản phẩm
    priceShip: { type: String, required: true }, // Giá vận chuyển
});

export const Setting = models?.Setting || model("Setting", SettingSchema);