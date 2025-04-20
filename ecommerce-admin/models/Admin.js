import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true }, // Email của admin
    createdAt: { type: Date, default: Date.now }, // Ngày thêm admin
});

export const Admin = models?.Admin || model("Admin", AdminSchema);