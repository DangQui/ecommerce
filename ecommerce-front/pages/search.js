import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import Header from "@/components/Header"; // Nhập Header

const StyledSection = styled.section`
    padding: 80px 0 50px 0; /* Thêm padding-top để tránh header che nội dung */
    min-height: 100vh; /* Đảm bảo nội dung chiếm toàn bộ chiều cao */
`;

const Title = styled.h1`
    font-size: 1.5rem;
    margin-bottom: 20px;
`;

const NoResults = styled.p`
    font-size: 1rem;
    color: #888;
`;

const SkeletonGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding-top: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const SkeletonCard = styled.div`
    background-color: #fff;
    padding: 20px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid #ddd;
    animation: pulse 1.5s infinite;
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    margin-bottom: 5px;
`;

const SkeletonInfo = styled.div`
    margin-top: 5px;
    height: 40px;
    background: #f0f0f0;
    border-radius: 4px;
    animation: pulse 1.5s infinite;
`;

export default function SearchPage() {
    const router = useRouter();
    const { query } = router.query;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (router.isReady && query) {
            setLoading(true);
            fetch(`/api/products?search=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    setProducts(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi khi lấy sản phẩm:", err);
                    setLoading(false);
                });
        }
    }, [query, router.isReady]);

    return (
        <>
            <Header /> {/* Thêm Header ở đầu trang */}
            <StyledSection>
                <Center>
                    <Title>Kết quả tìm kiếm cho: "{query || ''}"</Title>
                    {loading && (
                        <SkeletonGrid>
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <SkeletonCard />
                                    <SkeletonInfo />
                                </div>
                            ))}
                        </SkeletonGrid>
                    )}
                    {!loading && products.length === 0 && router.isReady && (
                        <NoResults>Không tìm thấy sản phẩm nào.</NoResults>
                    )}
                    {!loading && products.length > 0 && (
                        <ProductsGrid products={products} />
                    )}
                    {!query && router.isReady && (
                        <NoResults>Vui lòng nhập từ khóa tìm kiếm</NoResults>
                    )}
                </Center>
            </StyledSection>
        </>
    );
}