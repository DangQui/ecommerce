import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";

const PaddingTop = styled.div`
    padding-top: 80px;
`;

const FilterSection = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const FilterLabel = styled.label`
    font-size: 0.9rem;
    color: #333;
`;

const FilterSelect = styled.select`
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.9rem;
    background-color: white;
    cursor: pointer;
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const SubCategoryLink = styled(Link)`
    display: inline-block;
    padding: 5px 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    text-decoration: none;
    color: #333;
    font-size: 0.9rem;
    &:hover {
        background-color: #dee2e6;
    }
`;

const ClearFilterButton = styled.button`
    padding: 5px 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    &:hover {
        background-color: #c82333;
    }
`;

export default function CategoryPage({ category, subCategories, products, allProperties }) {
    const [priceRange, setPriceRange] = useState(''); // State cho khoảng giá được chọn
    const [selectedProperties, setSelectedProperties] = useState({});
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest');

    // Các khoảng giá cố định
    const priceRanges = [
        { label: "Tất cả", value: "", min: 0, max: Infinity },
        { label: "Dưới 3", value: "under-3m", min: 0, max: 3000000 },
        { label: "3 - 5 triệu", value: "3m-5m", min: 3000000, max: 5000000 },
        { label: "5 - 10 triệu", value: "5m-10m", min: 5000000, max: 10000000 },
        { label: "10 - 20 triệu", value: "10m-20m", min: 10000000, max: 20000000 },
        { label: "20 - 50 triệu", value: "20m-50m", min: 20000000, max: 50000000 },
        { label: "Trên 50 triệu", value: "above-50m", min: 50000000, max: Infinity },
    ];

    // Lọc và sắp xếp sản phẩm
    const filteredProducts = products
        .filter(product => {
            // Lọc theo khoảng giá
            const selectedRange = priceRanges.find(range => range.value === priceRange) || priceRanges[0];
            const price = product.price;
            if (price < selectedRange.min || price > selectedRange.max) return false;

            // Lọc theo thuộc tính
            for (const [key, value] of Object.entries(selectedProperties)) {
                if (value && product.properties[key] !== value) return false;
            }

            // Lọc theo danh mục con
            if (selectedSubCategory && product.category !== selectedSubCategory) return false;

            return true;
        })
        .sort((a, b) => {
            if (sortOrder === 'price-asc') return a.price - b.price;
            if (sortOrder === 'price-desc') return b.price - a.price;
            return 0;
        });

    // Xóa bộ lọc
    const clearFilters = () => {
        setPriceRange('');
        setSelectedProperties({});
        setSelectedSubCategory(null);
        setSortOrder('newest');
    };

    // Xử lý khi chọn thuộc tính
    const handlePropertyChange = (propertyName, value) => {
        setSelectedProperties(prev => ({
            ...prev,
            [propertyName]: value || undefined,
        }));
    };

    return (
        <>
            <Header />
            <Center>
                <PaddingTop>
                    <Title>{category.name}</Title>

                    {/* Bộ lọc */}
                    <FilterSection>
                        {/* Lọc theo khoảng giá */}
                        <FilterGroup>
                            <FilterLabel>Khoảng giá:</FilterLabel>
                            <FilterSelect
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                            >
                                {priceRanges.map((range, index) => (
                                    <option key={index} value={range.value}>
                                        {range.label}
                                    </option>
                                ))}
                            </FilterSelect>
                        </FilterGroup>

                        {/* Lọc theo danh mục con (nếu có) */}
                        {subCategories.length > 0 && (
                            <FilterGroup>
                                <FilterLabel>Danh mục con:</FilterLabel>
                                <FilterSelect
                                    value={selectedSubCategory || ''}
                                    onChange={(e) => setSelectedSubCategory(e.target.value || null)}
                                >
                                    <option value="">Tất cả</option>
                                    {subCategories.map(sub => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </FilterSelect>
                            </FilterGroup>
                        )}

                        {/* Lọc theo thuộc tính */}
                        {allProperties.map((property, index) => (
                            <FilterGroup key={index}>
                                <FilterLabel>{property.name}:</FilterLabel>
                                <FilterSelect
                                    value={selectedProperties[property.name] || ''}
                                    onChange={(e) => handlePropertyChange(property.name, e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    {property.values.map((value, idx) => (
                                        <option key={idx} value={value}>{value}</option>
                                    ))}
                                </FilterSelect>
                            </FilterGroup>
                        ))}

                        {/* Sắp xếp */}
                        <FilterGroup>
                            <FilterLabel>Sắp xếp:</FilterLabel>
                            <FilterSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                            </FilterSelect>
                        </FilterGroup>

                        {/* Nút xóa bộ lọc */}
                        {(priceRange || Object.keys(selectedProperties).length > 0 || selectedSubCategory || sortOrder !== 'newest') && (
                            <ClearFilterButton onClick={clearFilters}>
                                Xóa bộ lọc
                            </ClearFilterButton>
                        )}
                    </FilterSection>

                    {/* Danh sách sản phẩm */}
                    <ProductsGrid products={filteredProducts} />
                </PaddingTop>
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;

    // Lấy danh mục hiện tại
    const category = await Category.findById(id);

    // Lấy danh mục con (nếu có)
    const subCategories = await Category.find({ parent: id });

    // Lấy tất cả sản phẩm thuộc danh mục hiện tại và danh mục con
    const categoryIds = [id, ...subCategories.map(sub => sub._id)];
    const products = await Product.find({ category: { $in: categoryIds } }, null, { sort: { '_id': -1 } });

    // Lấy tất cả thuộc tính từ danh mục hiện tại
    const allProperties = category.properties || [];

    return {
        props: {
            category: JSON.parse(JSON.stringify(category)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            products: JSON.parse(JSON.stringify(products)),
            allProperties: JSON.parse(JSON.stringify(allProperties)),
        },
    };
}