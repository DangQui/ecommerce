import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";

const PaddingTop = styled.div`
    padding-top: 70px;
`;

export default function ProductsPage({products}) {
    console.log({products});
    return (
        <>
            <Header />
            <Center>
                <PaddingTop>
                    <Title className="padding-top: 20px">Tất Cả Sản Phẩm</Title>
                </PaddingTop>
                <ProductsGrid products={products} />
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, {sort:{'_id':-1}});
    return {
        props:{
            products: JSON.parse(JSON.stringify(products)),
        }
    };
}