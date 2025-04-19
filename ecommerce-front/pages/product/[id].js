import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function ProductPage() {
    return (
        <>
            <Header />
            <Center>
                <Title></Title>
            </Center>
        </>
    );
}

export async function getServerSideProps () {
    await mongooseConnect();
    const product = await Product.findById();
    return {
        props: {
            product: product,
        }
    }
}