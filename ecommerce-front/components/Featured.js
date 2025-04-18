import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icon/CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 50px 0;
`;
const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 3rem;
`;
const Desc = styled.p`
    color: #aaa;
    font-size: .8rem;
`;
const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 40px;
    img {
        max-width: 100%;
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

export default function Featured({ product }) {
    const { addProduct } = useContext(CartContext);

    function addFeaturedToCart() {
        if (product?._id) {
            addProduct(product._id);
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
        </Bg>
    );
}