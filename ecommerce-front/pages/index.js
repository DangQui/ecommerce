import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import ButtonLink from "@/components/ButtonLink";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";

const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`;

const CategoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export default function HomePage({ categories }) {
    return (
        <>
            <Header />
            <Center>
                {categories.map((category) => (
                    <CategoryWrapper key={category._id}>
                        <CategoryHeader>
                            <Title>{category.name}</Title>
                            <ButtonLink href={`/categories/${category._id}`}>
                                Hiển thị tất cả
                            </ButtonLink>
                        </CategoryHeader>
                        <ProductsGrid products={category.products} />
                    </CategoryWrapper>
                ))}
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();

    const categories = await Category.find().lean();
    const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
            const products = await Product.find({ category: category._id })
                .limit(4)
                .lean();
            return { ...category, products };
        })
    );

    return {
        props: {
            categories: JSON.parse(JSON.stringify(categoriesWithProducts)),
        },
    };
}