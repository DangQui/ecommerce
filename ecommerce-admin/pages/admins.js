import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        const response = await axios.get("/api/admins");
        setAdmins(response.data);
    };

    const addAdmin = async () => {
        if (!email) {
            alert("Vui lòng nhập email");
            return;
        }
        try {
            await axios.post("/api/admins", { email });
            setEmail("");
            fetchAdmins();
        } catch (error) {
            alert(error.response?.data?.error || "Không thể thêm quản trị viên");
        }
    };

    const deleteAdmin = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa quản trị viên này?")) {
            try {
                await axios.delete(`/api/admins?id=${id}`);
                fetchAdmins();
            } catch (error) {
                alert(error.response?.data?.error || "Không thể xóa quản trị viên");
            }
        }
    };

    return (
        <Layout>
            <h1 className="text-xl font-bold mb-4">Quản Trị Viên</h1>
            <div className="mb-4 flex flex-col md:flex-row gap-2">
                <input
                    type="email"
                    placeholder="Nhập email quản trị viên"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-sm p-2 flex-1"
                />
                <button
                    onClick={addAdmin}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-sm"
                >
                    Thêm quản trị viên
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">EMAIL QUẢN TRỊ VIÊN</th>
                            <th className="p-3">NGÀY TẠO</th>
                            <th className="p-3">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin._id} className="border-t">
                                <td className="p-3">{admin.email}</td>
                                <td className="p-3">{new Date(admin.createdAt).toLocaleString()}</td>
                                <td className="p-3">
                                    {admin.email === "dangdinhqui2001@gmail.com" ? (
                                        <span className="text-gray-500">Không thể xóa</span>
                                    ) : (
                                        <button
                                            onClick={() => deleteAdmin(admin._id)}
                                            className="bg-red-500 text-white px-4 py-1 rounded-sm"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}