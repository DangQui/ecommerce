import mongoose from 'mongoose';

export async function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}