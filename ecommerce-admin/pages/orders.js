import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";


const TR = styled.tr`
    text-align: left;
`;

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);

    return (
        <Layout>
            <h1>Danh Sách Đơn Hàng</h1>
            <table className="basic">
                <thead>
                    <TR>
                        <th>Ngày</th>
                        <th>Thanh toán</th>
                        <th>Người nhận</th>
                        <th>Sản phẩm</th>
                    </TR>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleDateString()}</td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </td>
                            <td>
                                {order.name} <br />
                                {order.email} <br />
                                {order.city}, {order.postalCode} <br />
                                {order.streetAddress}
                            </td>
                            <td>
                                {order.line_items.map((item, index) => (
                                    <span key={index}>
                                        {item.price_data.product_data.name} x {item.quantity} <br />
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