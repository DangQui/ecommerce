import Layout from "@/components/Layout";
import { Order } from "@/models/Order";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);

    return (
        <Layout>
            <h1>Đơn Hàng Đặt</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Thanh toán</th>
                        <th>Người nhận</th>
                        <th>Sản phẩm</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}> {/* Thêm key để tránh warning của React */}
                            <td>{(new Date(order.createdAt)).toLocaleDateString()}</td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </td>
                            <td>
                                {order.name} {order.email} <br />   
                                {order.city} {order.postalCode} <br/>
                                {order.phoneNumber} <br/>
                                {order.streetAddress} 
                            </td>
                            <td>
                                {order.line_items.map((l, index) => (
                                    <span key={index}> {/* Thêm key cho map */}
                                        {l.price_data?.product_data?.name} x 
                                        {l.quantity} <br/>
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}