import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .8fr; 
    }
    gap: 40px;
    margin-top: 100px;
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
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    img {
        max-width: 50px;
        max-height: 50px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        img {
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }

`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;



const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

export default function CartPage() {
  const router = useRouter();
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddres, setStreetAddres] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state cho thông báo lỗi

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, [clearCart]);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios
        .post("/api/cart", { ids: cartProducts })
        .then((response) => {
          setProducts(response.data || []);
        })
        .catch((error) => {
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
    // Kiểm tra các trường bắt buộc
    if (!name || !email || !city || !postalCode || !phoneNumber || !streetAddres) {
      setErrorMessage("Vui lòng nhập đầy đủ tất cả các thông tin!");
      return;
    }

    // Xóa thông báo lỗi nếu tất cả trường đã được điền
    setErrorMessage("");

    try {
      console.log("Dữ liệu gửi đi:", {
        name,
        email,
        city,
        postalCode,
        phoneNumber,
        streetAddres,
        cartProducts,
      }); // Log để debug
      const response = await axios.post("/api/checkout", {
        name,
        email,
        city,
        postalCode,
        phoneNumber,
        streetAddres,
        cartProducts,
      });

      if (response.data.url) {
        window.location = response.data.url;
      } else {
        setErrorMessage("Không nhận được URL thanh toán từ server.");
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện thanh toán:", error);
      setErrorMessage(
        error.response?.data?.error || "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại."
      );
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {
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
            {!cartProducts?.length && <div>Giỏ hàng của bạn đang trống!</div>}

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
                  {products.map((product) => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter((id) => id === product._id).length}
                        </QuantityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                      </td>
                      <td>
                        {(cartProducts.filter((id) => id === product._id).length * product.price).toLocaleString(
                          "vi-VN"
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>{total.toLocaleString("vi-VN")} VND</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>

          {!!cartProducts?.length && (
            <Box>
              <h2>Thông tin người đặt</h2>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <Input
                type="text"
                placeholder="Họ tên"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="example@gmail.com"
                value={email}
                name="email"
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <CityHolder>
                <Input
                  type="text"
                  placeholder="Thành phố"
                  value={city}
                  name="city"
                  onChange={(ev) => setCity(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Mã bưu chính"
                  value={postalCode}
                  name="postalCode"
                  onChange={(ev) => setPostalCode(ev.target.value)}
                />
              </CityHolder>
              <Input
                type="text"
                placeholder="Số điện thoại"
                value={phoneNumber}
                name="phoneNumber"
                onChange={(ev) => setPhoneNumber(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Địa chỉ cụ thể"
                value={streetAddres}
                name="streetAddres"
                onChange={(ev) => setStreetAddres(ev.target.value)}
              />
              <Button onClick={goToPayment} size={"l"} black block type="submit">
                Thanh toán ngay
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}