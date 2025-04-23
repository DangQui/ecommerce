import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/CategoriesGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";
import Link from "next/link";
import ProductBox from "@/components/CategoryBox";

const PaddingTop = styled.div`
    padding-top: 80px;
`;

const CategorySection = styled.div`
    margin-bottom: 20px;
`;

const CategoryTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0px;
    padding-top: 0px !important;
    h2 {
        margin: 0;
        margin-top: 40px;
        padding: 0;
        font-size: 1.5rem;
        line-height: 1;
    }
`;

const ShowAllLink = styled(Link)`
    color: #000;
    text-decoration: underline;
    font-size: 0.9rem;
    padding-top: 40px;
    &:hover {
        color: #555;
    }
`;

const CustomProductsGrid = styled(ProductsGrid)`
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 10px !important;
    row-gap: 10px !important;
    column-gap: 10px !important;
    padding-top: 0 !important;
`;

const ShowAllBox = styled(Link)`
    background-color: #dedede;
    padding: 20px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    text-decoration: none;
    color: #6c757d;
    font-weight: normal;
    font-size: 0.9rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; /* Thêm transition cho hiệu ứng hover */
    &:hover {
        background-color: #dee2e6;
        transform: scale(1.05); /* Phóng to nhẹ khi hover */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Thêm bóng nhẹ khi hover */
    }
    &::after {
        content: "→";
        margin-left: 5px;
        font-size: 1rem;
        color: #6c757d;
    }
`;

export default function CategoriesPage({ categoriesWithProducts }) {
    return (
        <>
            <Header />
            <Center>
                <PaddingTop>
                    {categoriesWithProducts.map(category => (
                        <CategorySection key={category._id}>
                            <CategoryTitle>
                                <h2>{category.name}</h2>
                                {category.products?.length > 0 && (
                                    <ShowAllLink href={`/category/${category._id}`}>
                                        Hiển thị tất cả
                                    </ShowAllLink>
                                )}
                            </CategoryTitle>
                            <CustomProductsGrid products={category.products}>
                                {category.products?.length > 0 ? (
                                    <>
                                        {category.products.slice(0, 3).map(product => (
                                            <ProductBox key={product._id} {...product} />
                                        ))}
                                        <ShowAllBox href={`/category/${category._id}`}>
                                            Hiển thị tất cả
                                        </ShowAllBox>
                                    </>
                                ) : (
                                    <p>Không có sản phẩm nào trong danh mục này</p>
                                )}
                            </CustomProductsGrid>
                        </CategorySection>
                    ))}
                </PaddingTop>
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const categories = await Category.find({ parent: null });
    const categoriesWithProducts = [];

    for (const category of categories) {
        const products = await Product.find({ category: category._id }, null, { sort: { '_id': -1 }, limit: 3 });
        categoriesWithProducts.push({
            ...JSON.parse(JSON.stringify(category)),
            products: JSON.parse(JSON.stringify(products)),
        });
    }

    return {
        props: {
            categoriesWithProducts,
        },
    };
}