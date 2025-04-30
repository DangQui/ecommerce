import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Review from "@/components/Review";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Review as ReviewModel } from "@/models/Review"; // Import model Review để lấy dữ liệu
import styled from "styled-components";
import { primary } from './../../lib/colors';
import CartIcon from "@/components/icon/CartIcon";
import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import LoginPromptModal from "@/components/LoginPromptModal";

// Thêm styled component cho phần hiển thị sao trung bình
const StarWrapper = styled.div`
    display: flex;
    gap: 5px;
    margin-top: 10px;
`;

const Star = styled.span`
    font-size: 1.2rem;
    color: ${props => (props.filled ? '#FFD700' : '#ccc')};
`;

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: .8fr 1.2fr;
    }
    gap: 40px;
    margin: 40px 0;
`;

const PageWrapper = styled.div`
    margin-top: 120px; /* Thêm khoảng cách giữa header và nội dung */
`;

const PriceRow = styled.div`
    gap: 20px;
    display: flex;
    align-items: center;
`;

const Price = styled.span`
    font-size: 1.5rem;
`;

const Notification = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1002;
    background-color: #4caf50; /* Màu xanh lá cây */
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    animation: slideDown 0.5s ease-in-out forwards, fadeOut 0.5s ease-in-out 4.5s forwards;

    @keyframes slideDown {
        0% {
            transform: translateY(-100%);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-100%);
        }
    }

    &:before {
        content: '✔';
        font-size: 1.2rem;
    }
`;

export default function ProductPage({ product, averageRating }) {
    const { addProduct } = useContext(CartContext);
    const { isAuthenticated } = useAuth();
    const [showNotification, setShowNotification] = useState(false);
    const [showModal, setShowModal] = useState(false);

    function addToCart() {
        if (!isAuthenticated) {
            setShowModal(true);
        } else {
            addProduct(product._id);
            setShowNotification(true);
        }
    }

    // Hàm để hiển thị sao trung bình
    const renderAverageRating = () => {
        if (!averageRating || averageRating === 0) {
            return <p>Chưa có đánh giá</p>;
        }

        const roundedRating = Math.round(averageRating); // Làm tròn để hiển thị sao
        return (
            <StarWrapper>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        filled={star <= roundedRating}
                    >
                        ★
                    </Star>
                ))}
            </StarWrapper>
        );
    };

    return (
        <>
            <Header />
            <PageWrapper>
                <Center>
                    <ColWrapper>
                        <WhiteBox>
                            <ProductImages images={product.images} />
                        </WhiteBox>
                        <div>
                            <Title>{product.title}</Title>
                            {renderAverageRating()} {/* Hiển thị sao trung bình ngay dưới tiêu đề */}
                            <p>{product.description}</p>
                            <PriceRow>
                                <Price>{product.price.toLocaleString("vi-VN")} VND</Price>
                                <Button primary outline onClick={addToCart}>
                                    <CartIcon />
                                    Thêm vào giỏ hàng
                                </Button>
                            </PriceRow>
                        </div>
                    </ColWrapper>
                    <Review productId={product._id} />
                </Center>
                {showNotification && (
                    <Notification onAnimationEnd={() => setShowNotification(false)}>
                        Đã thêm vào giỏ hàng!
                    </Notification>
                )}
                {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}
            </PageWrapper>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;

    // Lấy thông tin sản phẩm
    const product = await Product.findById(id);

    // Lấy danh sách đánh giá của sản phẩm
    const reviews = await ReviewModel.find({ product: id });

    // Tính trung bình số sao
    let averageRating = 0;
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = totalRating / reviews.length;
    }

    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
            averageRating, // Truyền trung bình số sao vào props
        },
    };
}