import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.query.stats === "true") {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        console.log("Start of Day:", startOfDay);
        console.log("Start of Week:", startOfWeek);
        console.log("Start of Month:", startOfMonth);

        const ordersToday = await Order.find({ createdAt: { $gte: startOfDay } });
        const ordersThisWeek = await Order.find({ createdAt: { $gte: startOfWeek } });
        const ordersThisMonth = await Order.find({ createdAt: { $gte: startOfMonth } });

        const revenueToday = ordersToday.reduce((sum, order) => 
            sum + order.line_items.reduce((itemSum, item) => 
                itemSum + (item.price_data.unit_amount * item.quantity), 0), 0);
        const revenueThisWeek = ordersThisWeek.reduce((sum, order) => 
            sum + order.line_items.reduce((itemSum, item) => 
                itemSum + (item.price_data.unit_amount * item.quantity), 0), 0);
        const revenueThisMonth = ordersThisMonth.reduce((sum, order) => 
            sum + order.line_items.reduce((itemSum, item) => 
                itemSum + (item.price_data.unit_amount * item.quantity), 0), 0);

        return res.json({
            orders: {
                today: ordersToday.length,
                thisWeek: ordersThisWeek.length,
                thisMonth: ordersThisMonth.length,
            },
            revenue: {
                today: revenueToday,
                thisWeek: revenueThisWeek,
                thisMonth: revenueThisMonth,
            },
        });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
}