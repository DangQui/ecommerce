import mongoose from 'mongoose';

const TempUserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const TempUser = mongoose.models.TempUser || mongoose.model('TempUser', TempUserSchema);
export default TempUser;