import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import { buffer } from 'micro';

const endpointSecret = "whsec_05fe04d0ced97e777918b4faf57feb815949ebb20ba3c3b7575a8e431cb29b5b";

export default async function handler(req, res) {
    await mongooseConnect();

    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            const orderId = data.metadata.orderId;
            const paid = data.payment_status === 'paid';
            if (orderId && paid) {
                const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                    paid: true,
                }, { new: true });
                console.log('Updated Order:', updatedOrder); // Log kết quả cập nhật
            } else {
                console.log('Order ID or payment status invalid');
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('ok');
}

export const config = {
    api: { bodyParser: false },
};