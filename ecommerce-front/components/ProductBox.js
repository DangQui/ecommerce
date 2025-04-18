import styled from "styled-components";
import Button from "./Button";
import CartIcon from "./icon/CartIcon";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div`
    
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
    img{
        max-width: 100%;
        max-height: 80px;
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: 0.9rem;
    margin: 0;
    color: inherit;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden; /* Ẩn phần văn bản tràn ra ngoài */
    text-overflow: ellipsis; /* Thêm dấu ba chấm khi văn bản bị cắt */
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

export default function ProductBox({_id, title, description, price, images}) {
    const {addProduct} = useContext(CartContext);
    const url = '/products/' + _id;
    // Hàm định dạng giá với dấu chấm
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <img src={images?.[0]} alt="" />
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>{formatPrice(price)}</Price>
                    <Button onClick={() => addProduct(_id)} primary outline>
                        <CartIcon/>
                    </Button>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    );
}