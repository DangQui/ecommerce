import styled from "styled-components";
import Button from "./Button";
import CartIcon from "./icon/CartIcon";
import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Nhập useAuth
import LoginPromptModal from "./LoginPromptModal"; // Nhập LoginPromptModal

const ProductWrapper = styled.div`
    margin-top: 0px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    &.visible {
        opacity: 1;
        transform: translateY(0);
    }
    &:hover {
        transform: translateY(-5px); /* Nâng nhẹ khi hover */
        transition: transform 0.3s ease;
    }
`;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    img {
        max-width: 100%;
        max-height: 80px;
    }
    &:hover {
        transform: scale(1.05); /* Phóng to nhẹ khi hover */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Thêm bóng nhẹ khi hover */
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: 0.9rem;
    margin: 0;
    color: inherit;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
    gap: 5px;
`;

const Price = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
`;

const FlyingImage = styled.img`
    position: fixed;
    z-index: 1001;
    width: 80px;
    height: 80px;
    object-fit: contain;
    pointer-events: none;
    animation: flyToCart 0.8s ease-in-out forwards;
    
    @keyframes flyToCart {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(0.7);
            opacity: 0.8;
        }
        100% {
            transform: scale(0.3) translate(var(--delta-x), var(--delta-y));
            opacity: 0;
        }
    }
`;

export default function ProductBox({ _id, title, description, price, images }) {
    const { addProduct } = useContext(CartContext);
    const { isAuthenticated } = useAuth(); // Sử dụng useAuth để kiểm tra trạng thái đăng nhập
    const url = '/products/' + _id;
    const [flyingImage, setFlyingImage] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false); // Thêm trạng thái showModal
    const productRef = useRef(null);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(productRef.current);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (productRef.current) {
            observer.observe(productRef.current);
        }

        return () => {
            if (productRef.current) {
                observer.unobserve(productRef.current);
            }
        };
    }, []);

    const handleAddToCart = (e) => {
        e.preventDefault();

        // Kiểm tra nếu người dùng chưa đăng nhập
        if (!isAuthenticated) {
            setShowModal(true); // Hiển thị modal yêu cầu đăng nhập
            return;
        }

        // Nếu đã đăng nhập, tiếp tục thêm sản phẩm vào giỏ hàng
        addProduct(_id);

        const imageElement = e.currentTarget.closest('.product-wrapper').querySelector('img');
        if (!imageElement) return;

        const cartIcon = document.getElementById('cart-icon');
        if (!cartIcon) return;

        const imageRect = imageElement.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const flyingImg = document.createElement('img');
        flyingImg.src = images?.[0];
        flyingImg.className = 'flying-image';
        document.body.appendChild(flyingImg);

        flyingImg.style.left = `${imageRect.left}px`;
        flyingImg.style.top = `${imageRect.top}px`;

        const deltaX = cartRect.left + cartRect.width / 2 - imageRect.left - imageRect.width / 2;
        const deltaY = cartRect.top + cartRect.height / 2 - imageRect.top - imageRect.height / 2;

        flyingImg.style.setProperty('--delta-x', `${deltaX}px`);
        flyingImg.style.setProperty('--delta-y', `${deltaY}px`);

        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = `
            .flying-image {
                position: fixed;
                z-index: 1001;
                width: 80px;
                height: 80px;
                object-fit: contain;
                pointer-events: none;
                animation: flyToCart 0.8s ease-in-out forwards;
            }
            @keyframes flyToCart {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(0.7);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0.3) translate(var(--delta-x), var(--delta-y));
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);

        setFlyingImage(flyingImg);
        setTimeout(() => {
            flyingImg.remove();
            styleSheet.remove();
            setFlyingImage(null);
        }, 800);
    };

    return (
        <>
            <ProductWrapper
                className={`product-wrapper ${isVisible ? 'visible' : ''}`}
                ref={productRef}
            >
                <WhiteBox href={url}>
                    <div>
                        <img src={images?.[0]} alt="" />
                    </div>
                </WhiteBox>
                <ProductInfoBox>
                    <Title href={url}>{title}</Title>
                    <PriceRow>
                        <Price>{formatPrice(price)}</Price>
                        <Button onClick={handleAddToCart} primary={true} outline={true}>
                            <CartIcon />
                        </Button>
                    </PriceRow>
                </ProductInfoBox>
            </ProductWrapper>
            {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}
        </>
    );
}