import styled from "styled-components";

const StyleProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding-top: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

export default function ProductsGrid({ products, children }) {
    return (
        <StyleProductsGrid>
            {children}
        </StyleProductsGrid>
    );
}