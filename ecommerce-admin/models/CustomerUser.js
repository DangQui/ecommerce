import mongoose from 'mongoose';

const CustomerUserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    isDisabled: { type: Boolean, default: false },
});

const CustomerUser = mongoose.models.CustomerUser || mongoose.model('CustomerUser', CustomerUserSchema);
export default CustomerUser;