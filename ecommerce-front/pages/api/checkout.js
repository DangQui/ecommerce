import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK);
import mongoose, { Schema, model, models } from "mongoose";

// Định nghĩa model Setting
const SettingSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    priceShip: { type: String, required: true },
});

const Setting = models?.Setting || model("Setting", SettingSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Should be a POST request' });
        return;
    }

    const {
        name, email, city, postalCode, 
        phoneNumber, streetAddres, cartProducts,
    } = req.body;

    await mongooseConnect();

    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({ _id: uniqueIds });

    // Lấy phí vận chuyển từ collection settings
    const settings = await Setting.find();

    let line_items = [];
    for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;

        // Tìm phí vận chuyển cho sản phẩm
        const setting = settings.find(s => s.id === productId);
        const shippingPrice = setting ? parseInt(setting.priceShip.replace(/\./g, "")) : 0;

        if (quantity > 0 && productInfo) {
            const unitAmount = Math.round(productInfo.price + shippingPrice); // Cộng phí vận chuyển vào giá sản phẩm
            line_items.push({
                quantity,
                price_data: {
                    currency: 'VND',
                    product_data: {
                        name: productInfo.title || productInfo.product_name || 'Unnamed Product',
                    },
                    unit_amount: unitAmount, // Tổng giá (giá sản phẩm + phí vận chuyển)
                },
            });
        }
    }

    const orderDoc = await Order.create({
        line_items, 
        name, email, 
        city, postalCode, 
        phoneNumber, streetAddres, paid: false,
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: `${process.env.PUBLIC_URL}/cart?success=1`,
            cancel_url: `${process.env.PUBLIC_URL}/cart?canceled=1`,
            metadata: { orderId: orderDoc._id.toString(), test: 'ok' },
        });

        res.json({
            url: session.url,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}