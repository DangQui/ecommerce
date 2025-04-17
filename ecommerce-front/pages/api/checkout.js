import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Should be a POST request' });
        return;
    }

    const {
        name, email, city, postalCode, 
        phoneNumber, streetAddres, cartProducts,
    } = req.body;

    // Kết nối MongoDB
    await mongooseConnect();

    // Lấy danh sách product IDs từ request
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({ _id: uniqueIds });

    // Tạo line_items cho Stripe Checkout
    let line_items = [];
    for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;

        if (quantity > 0 && productInfo) {
            const unitAmount = Math.round(productInfo.price); // VND không có đơn vị nhỏ hơn
            line_items.push({
                quantity,
                price_data: {
                    currency: 'VND',
                    product_data: {
                        name: productInfo.title || productInfo.product_name || 'Unnamed Product',

                    },
                    unit_amount: unitAmount,
                },
            });
        }
    }

    // Tạo order trong database
    const orderDoc = await Order.create({
        line_items, 
        name, email, 
        city, postalCode, 
        phoneNumber, streetAddres, paid: false,
    });

    // Tạo Stripe Checkout Session
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Thêm dòng này để hỗ trợ thanh toán bằng thẻ
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: `${process.env.PUBLIC_URL}/cart?success=1`,
            cancel_url: `${process.env.PUBLIC_URL}/cart?canceled=1`,
            metadata: { orderId: orderDoc._id.toString() },
        });

        res.json({
            url: session.url,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}