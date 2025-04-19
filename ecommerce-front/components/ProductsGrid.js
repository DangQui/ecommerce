import styled from "styled-components";
import ProductBox from "./ProductBox";

const StyleProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 30px;
    padding-top: 20px;
`;

export default function ProductsGrid({products}) {
    return (
        <StyleProductsGrid>
            {products?.length > 0 ? (
                            products.map((product) => (
                                <ProductBox key={product._id} {...product} />
                            ))
                        ) : (
                            <p>Không có sản phẩm nào để hiển thị</p>
                        )}
        </StyleProductsGrid>
    );
}