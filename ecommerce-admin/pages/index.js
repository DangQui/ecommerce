import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ orders: {}, revenue: {} });

    useEffect(() => {
        axios.get('/api/orders?stats=true').then(response => {
            const data = response.data;

            // Chuyển đổi thời gian sang múi giờ Việt Nam
            const convertToVietnamTime = (date) => {
                const vietnamTime = new Date(date).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                });
                return vietnamTime;
            };

            // Nếu API trả về thời gian, bạn có thể xử lý tại đây (nếu cần)
            setStats(data);
        });
    }, []);

    return (
        <Layout>
            <div className="text-blue-900 flex justify-between items-center">
                <h2>
                    Xin chào, <b>{session?.user?.name}</b>
                </h2>
                <div className="flex bg-gray-300 gap-2 text-black rounded-lg overflow-hidden items-center">
                    <img src={session?.user?.image} alt="" className="w-8 h-8 rounded-full" />
                    <span className="px-2">
                        {session?.user?.name}
                    </span>
                </div>
            </div>
            <div className="mt-8">
                {/* Tiêu đề hàng trên */}
                <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-4">Đặt Hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hàng trên: Số lượng đặt */}
                    <div className="bg-white shadow-md rounded-lg p-3 md:p-4 text-center">
                        <h3 className="text-sm md:text-gray-500">HÔM NAY</h3>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">{stats.orders.today || 0}</p>
                        <p className="text-sm md:text-gray-500">{stats.orders.today || 0} đơn hàng hôm nay</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-3 md:p-4 text-center">
                        <h3 className="text-sm md:text-gray-500">TUẦN NÀY</h3>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">{stats.orders.thisWeek || 0}</p>
                        <p className="text-sm md:text-gray-500">{stats.orders.thisWeek || 0} đơn hàng tuần này</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-3 md:p-4 text-center">
                        <h3 className="text-sm md:text-gray-500">THÁNG NÀY</h3>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">{stats.orders.thisMonth || 0}</p>
                        <p className="text-sm md:text-gray-500">{stats.orders.thisMonth || 0} đơn hàng tháng này</p>
                    </div>
                </div>

                {/* Tiêu đề hàng dưới */}
                <h3 className="text-lg md:text-xl font-bold text-gray-700 mt-8 mb-4">Doanh Thu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hàng dưới: Doanh thu */}
                    <div className="bg-white shadow-md rounded-lg p-3 md:p-4 text-center">
                        <h3 className="text-sm md:text-gray-500">HÔM NAY</h3>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">
                            {stats.revenue.today?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫"}
                        </p>
                        <p className="text-sm md:text-gray-500">{stats.orders.today || 0} đơn hàng hôm nay</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-3 md:p-4 text-center">
                        <h3 className="text-sm md:text-gray-500">TUẦN NÀY</h3>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">
                            {stats.revenue.thisWeek?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫"}
                        </p>
                        <p className="text-sm md:text-gray-500">{stats.orders.thisWeek || 0} đơn hàng tuần này</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-3 md:p-4 text-center">
                        <h3 className="text-sm md:text-gray-500">THÁNG NÀY</h3>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">
                            {stats.revenue.thisMonth?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫"}
                        </p>
                        <p className="text-sm md:text-gray-500">{stats.orders.thisMonth || 0} đơn hàng tháng này</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
