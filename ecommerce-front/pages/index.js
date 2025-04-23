import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import ButtonLink from "@/components/ButtonLink";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";
import { Category } from "@/models/Category";
import styled from "styled-components";

export default function HomePage({featuredProduct, newProducts}) {
    return (
      <div>
        <Header />
        <Featured product  = {featuredProduct} />
        <NewProducts products = {newProducts} />
      </div>
    );
}

export async function getServerSideProps() {
    
   const featuredProductId = '68021c6365a0a5fb189caef7';
   await mongooseConnect();
   const featuredProduct = await Product.findById(featuredProductId);
   const newProducts = await Product.find({}, null, {sort: {'_id': -1}, limit: 10});
   return {
     props: {
       featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
       newProducts: JSON.parse(JSON.stringify(newProducts)),
     },
   };
}