import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    img {
        max-width: 80px;
        max-height: 80px;
    }
`;

const QuantityLabel = styled.span`
    padding: 0 3px;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function CartPage() {
    const { cartProducts, addProduct, removeProduct } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddres, setStreetAddres] = useState('');

    useEffect(() => {
        if (cartProducts?.length > 0) {
            axios.post('/api/cart', { ids: cartProducts }).then(response => {
                setProducts(response.data || []);
            }).catch(error => {
                console.error("Error fetching cart products:", error);
                setProducts([]);
            });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    function moreOfThisProduct(id) {
        addProduct(id);
    }
    function lessOfThisProduct(id) {
        removeProduct(id);
    }
    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name, email, city, postalCode, phoneNumber, streetAddres, cartProducts,
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
    }

    let total = 0;

    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    if (window.location.href.includes('success')){
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Bạn đã thanh toán thành công!</h1>
                            <p>Chúng tôi sẽ gửi email cho bạn khi đơn hàng được gửi đi.</p>
                        </Box>
                    </ColumnsWrapper>
                </Center>
            </>
        );
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Giỏ hàng</h2>
                        {!cartProducts?.length && (
                            <div>Giỏ hàng của bạn đang trống!</div>
                        )}

                        {products?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} alt="" />
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button onClick ={() => lessOfThisProduct(product._id)}>-</Button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}  
                                                </QuantityLabel>
                                                <Button onClick = {() => moreOfThisProduct(product._id)}>
                                                    +
                                                </Button>
                                            </td>
                                            <td>
                                                {(cartProducts.filter(id => id === product._id).length * product.price).toLocaleString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>{total.toLocaleString('vi-VN')}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        )}
                    </Box>

                    {!!cartProducts?.length && (
                        <Box>
                            <h2>Thông tin đơn hàng</h2>
                            <Input type="text" 
                                        placeholder="Họ tên"
                                        value={name}
                                        name="name" 
                                        onChange={ev => setName(ev.target.value)} 
                                />
                                <Input type="text" 
                                        placeholder="example@gmail.com" 
                                        value={email}
                                        name="email" 
                                        onChange={ev => setEmail(ev.target.value)} 
                                />
                                <CityHolder>
                                    <Input type="text" 
                                            placeholder="Thành phố" 
                                            value={city}
                                            name="city" 
                                            onChange={ev => setCity(ev.target.value)}  
                                    />
                                    <Input type="text" 
                                            placeholder="Mã bưu chính" 
                                            value={postalCode}
                                            name="postalCode" 
                                            onChange={ev => setPostalCode(ev.target.value)}
                                    />
                                </CityHolder>
                                <Input type="text" 
                                        placeholder="Số điện thoại" 
                                        value={phoneNumber}
                                        name="phoneNumber" 
                                        onChange={ev => setPhoneNumber(ev.target.value)} 
                                />
                                <Input type="text" 
                                        placeholder="Địa chỉ cụ thể" 
                                        value={streetAddres}
                                        name="streetAddres" 
                                        onChange={ev => setStreetAddres(ev.target.value)} 
                                />
                                <Button 
                                    onClick={goToPayment} 
                                    size={'l'} black block 
                                    type="submit">
                                    Thanh toán ngay
                                </Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    );
}