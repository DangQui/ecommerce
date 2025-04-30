import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [email, setEmail] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [showModal, setShowModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        const response = await axios.get("/api/admins");
        setAdmins(response.data);
    };

    const addAdmin = async () => {
        if (!email) {
            setNotification({ message: "Vui lòng nhập email", type: "error" });
            setTimeout(() => setNotification({ message: "", type: "" }), 3000);
            return;
        }
        try {
            await axios.post("/api/admins", { email });
            setEmail("");
            fetchAdmins();
            setNotification({ message: "Thêm quản trị viên thành công", type: "success" });
            setTimeout(() => setNotification({ message: "", type: "" }), 3000);
        } catch (error) {
            setNotification({
                message: error.response?.data?.error || "Không thể thêm quản trị viên",
                type: "error",
            });
            setTimeout(() => setNotification({ message: "", type: "" }), 3000);
        }
    };

    const confirmDelete = (id) => {
        setAdminToDelete(id);
        setShowModal(true);
    };

    const deleteAdmin = async () => {
        try {
            await axios.delete(`/api/admins?id=${adminToDelete}`);
            fetchAdmins();
            setShowModal(false);
            setNotification({ message: "Xóa quản trị viên thành công", type: "success" });
            setTimeout(() => setNotification({ message: "", type: "" }), 3000);
        } catch (error) {
            setShowModal(false);
            setNotification({
                message: error.response?.data?.error || "Không thể xóa quản trị viên",
                type: "error",
            });
            setTimeout(() => setNotification({ message: "", type: "" }), 3000);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setAdminToDelete(null);
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
                    className="border border-gray-300 rounded-sm p-2 mb-0! flex-1"
                />
                <button
                    onClick={addAdmin}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-sm hover:bg-indigo-700"
                >
                    Thêm quản trị viên
                </button>
            </div>
            {notification.message && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
                        notification.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {notification.message}
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa quản trị viên này?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-black px-4 py-2 rounded-sm hover:bg-gray-400"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={deleteAdmin}
                                className="bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                            onClick={() => confirmDelete(admin._id)}
                                            className="bg-red-500 text-white px-4 py-1 rounded-sm hover:bg-red-600"
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