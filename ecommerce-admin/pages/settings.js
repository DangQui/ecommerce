import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SettingsPage() {
    const [featuredProduct, setFeaturedProduct] = useState(""); // ID sản phẩm
    const [priceShip, setPriceShip] = useState(""); // Giá vận chuyển
    const [products, setProducts] = useState([]); // Danh sách sản phẩm
    const [notification, setNotification] = useState(""); // Thông báo

    useEffect(() => {
        // Lấy dữ liệu cài đặt và danh sách sản phẩm từ API
        axios.get("/api/settings").then((response) => {
            const { products } = response.data;
            setProducts(products); // Lưu danh sách sản phẩm
        });
    }, []);

    const formatPrice = (value) => {
        // Định dạng giá trị với dấu '.'
        return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handlePriceShipChange = (e) => {
        const rawValue = e.target.value.replace(/\./g, ""); // Loại bỏ dấu '.' trước khi lưu
        setPriceShip(formatPrice(rawValue));
    };

    const handleFeaturedProductChange = (e) => {
        const selectedProductId = e.target.value;
        setFeaturedProduct(selectedProductId);

        // Tìm sản phẩm được chọn và cập nhật giá vận chuyển
        const selectedProduct = products.find((p) => p.id === selectedProductId);
        setPriceShip(selectedProduct ? formatPrice(selectedProduct.priceShip || "") : "");
    };

    const saveSettings = async () => {
        const rawPriceShip = priceShip.replace(/\./g, ""); // Loại bỏ dấu '.' trước khi gửi
        const selectedProduct = products.find((p) => p.id === featuredProduct);

        await axios.post("/api/settings", {
            id: featuredProduct,
            name: selectedProduct ? selectedProduct.name : "",
            priceShip: rawPriceShip,
        });

        setNotification("Cài đặt đã được lưu!"); // Hiển thị thông báo
        setTimeout(() => setNotification(""), 3000); // Ẩn thông báo sau 3 giây
    };

    return (
        <Layout>
            <h1 className="text-xl font-bold mb-4">Cài Đặt</h1>
            <div className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Sản phẩm nổi bật</label>
                    <select
                        value={featuredProduct}
                        onChange={handleFeaturedProductChange}
                        className="w-full border border-gray-300 rounded-sm p-2"
                    >
                        <option value="">Chọn sản phẩm</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Giá vận chuyển (VND)</label>
                    <input
                        type="text"
                        value={priceShip}
                        onChange={handlePriceShipChange}
                        className="w-full border border-gray-300 rounded-sm p-2"
                        placeholder="Nhập giá vận chuyển"
                    />
                </div>
                <button
                    onClick={saveSettings}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-sm"
                >
                    Lưu Cài Đặt
                </button>
                {notification && (
                    <div className="mt-4 bg-green-100 text-green-800 p-2 rounded-sm">
                        {notification}
                    </div>
                )}
            </div>
        </Layout>
    );
}