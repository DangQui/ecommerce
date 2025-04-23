import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icon/CartIcon";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";

const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 110px 0; // 110px 0
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 1.5rem;
    @media screen and (min-width: 768px) {

    }
`;

const Desc = styled.p`
    color: #aaa;
    font-size: .8rem;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    img {
        max-width: 100%;
        max-height: 200px;
        display: block;
        margin: 0 auto;
    }
    div:nth-child(1) {
        order: 2;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.1fr 0.9fr;
        div:nth-child(1) {
            order: 0;
        }
        img {
            max-width: 100%;
        }
    }
`;

const Column = styled.div`
    display: flex;
    align-items: center;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
`;

const LoadingMessage = styled.div`
    text-align: center;
    font-size: 1.2rem;
    color: #aaa;
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

export default function Featured({ product }) {
    const { addProduct } = useContext(CartContext);
    const [showNotification, setShowNotification] = useState(false);

    function addFeaturedToCart() {
        if (product?._id) {
            addProduct(product._id);
            setShowNotification(true);
        }
    }

    // Hiển thị loading state nếu product là null hoặc undefined
    if (!product) {
        return (
            <Bg>
                <Center>
                    <LoadingMessage>Đang tải sản phẩm...</LoadingMessage>
                </Center>
            </Bg>
        );
    }

    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>{product.description}</Desc>
                            <ButtonWrapper>
                                <ButtonLink href={`/pr/${product._id}`} outline={1} white={1}>
                                    Đọc thêm
                                </ButtonLink>
                                <Button onClick={addFeaturedToCart} white>
                                    <CartIcon />
                                    Thêm vào Giỏ hàng
                                </Button>
                            </ButtonWrapper>
                        </div>
                    </Column>
                    <Column>
                        <img
                            src={product.images?.[0] || "https://quisk-next-ecommerce.s3.amazonaws.com/1744792123229.png"}
                            alt={product.title}
                        />
                    </Column>
                </ColumnsWrapper>
            </Center>
            {showNotification && (
                <Notification onAnimationEnd={() => setShowNotification(false)}>
                    Đã thêm vào giỏ hàng!
                </Notification>
            )}
        </Bg>
    );
}