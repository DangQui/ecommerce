import styled from "styled-components";
import Center from "./Center";
import ProductBox from "./ProductBox";

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 30px;
    padding-top: 20px;
`;

export default function NewProducts({products}) {
    return (
        <Center>
            <h2>Sản Phẩm Mới</h2>
            <ProductsGrid>
            {products?.length > 0 ? (
                products.map((product) => (
                    <ProductBox key={product._id} {...product} />
                ))
            ) : (
                <p>Không có sản phẩm nào để hiển thị</p>
            )}
            </ProductsGrid>
        </Center>
    );
}