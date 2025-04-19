import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import { primary } from './../../lib/colors';
import CartIcon from "@/components/icon/CartIcon";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: .8fr 1.2fr;
    gap: 40px;
    margin-top: 40px;
`;

const PriceRow = styled.div`
    gap: 20px;
    display: flex;
    align-items: center;
`;

const Price = styled.span`
    font-size: 1.5rem;
`;

export default function ProductPage({product}) {

    const {addProduct} = useContext(CartContext);

    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />   
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <p>{product.description}</p>

                        <PriceRow>
                            <div>
                                <Price>{product.price.toLocaleString('vi-VN')} VND </Price>
                            </div>
                            <div>
                                <Button primary onClick={() => addProduct(product._id)}>
                                    <CartIcon/> 
                                    Thêm vào giỏ hàng
                                </Button>
                            </div>
                            
                            
                        </PriceRow>
                        
                    </div>
                </ColWrapper>
                <Title>{product.title}</Title>
            </Center>
        </>
    );
}

export async function getServerSideProps (context) {
    await mongooseConnect();
    const {id} = context.query;
    const product = await Product.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        }
    }
}