import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const StyledHeader = styled.header`
    background-color: #222;
`;
const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    
`;
const StyledNav = styled.nav`
    display: flex;
    gap: 15px;
`;
const NavLink = styled(Link)`
    color: #aaa;
    text-decoration: none;
`;

export default function Header() {
    const {cartProducts} = useContext(CartContext);
    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>QuisK Shop</Logo>
                    <StyledNav>
                        <NavLink href={'/'}>Trang chủ</NavLink>
                        <NavLink href={'/products'}>Sản phẩm</NavLink>
                        <NavLink href={'/categories'}>Danh mục</NavLink>
                        <NavLink href={'/account'}>Tài khoản</NavLink>
                        <NavLink href={'/cart'}>Giỏ hàng ({cartProducts.length})</NavLink>
                    </StyledNav>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}