import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import BarsIcon from "./icon/Bars";
import SearchIcon from "./icon/Search";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import LoginPromptModal from "./LoginPromptModal";

const StyledHeader = styled.header`
    background-color: #222;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
`;

const Logo = styled(Link)`
    display: flex;
    align-items: center;
    color: #fff;
    text-decoration: none;
    position: relative;
    z-index: 3;
`;

const LogoImage = styled.img`
    width: 50px;
    height: 50px;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding: 20px 0;
    }
`;

const StyledNav = styled.nav`
    ${props => props.mobileNavActive ? `
        display: block;
    ` : `
        display: none;
    `}
    gap: 15px;
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: ${props => props.active ? '#fff' : '#aaa'}; /* Màu trắng khi active, xám khi không active */
    text-decoration: none;
    padding: 10px 0;
    font-weight: ${props => props.active ? '600' : 'normal'}; /* Đậm hơn khi active */
    transition: color 0.2s ease, font-weight 0.2s ease; /* Hiệu ứng chuyển màu mượt mà */
    @media screen and (min-width: 768px) {
        padding: 0;
    }
    &:hover {
        color: #fff; /* Màu trắng khi hover */
    }
`;

const NavButton = styled.button`
    background-color: transparent;
    width: 35px;
    height: 35px;
    border: 0;
    color: white;
    cursor: pointer;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const SearchButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    width: 35px;
    height: 35px;
    z-index: 3;
    cursor: pointer;
    svg {
        stroke: #fff !important;
        width: 24px;
        height: 24px;
    }
    @media screen and (max-width: 767px) {
        display: none;
    }
`;

const SearchWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    @media screen and (max-width: 767px) {
        flex: 1;
        margin-left: 10px;
        align-items: center;
    }
    @media screen and (min-width: 768px) {
        align-items: center;
    }
`;

const SearchInputWrapper = styled.div`
    position: relative;
    width: 100%;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 5px 30px 5px 10px;
    background-color: #333;
    color: #fff;
    border: 1px solid #444;
    border-radius: 4px;
    z-index: 1001;
    font-size: 14px;
    @media screen and (max-width: 767px) {
        border: none;
    }
    @media screen and (min-width: 768px) {
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-100%);
        margin-top: 5px;
        padding: 5px;
        width: 200px;
    }
`;

const SearchIconWrapper = styled.div`
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        stroke: #fff !important;
        width: 20px;
        height: 20px;
    }
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const SuggestionsList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #333;
    color: #fff;
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #444;
    border-radius: 4px;
    z-index: 1000;
    @media screen and (min-width: 768px) {
        top: 75px;
        left: 50%;
        transform: translateX(-100%);
        width: 200px;
    }
`;

const SuggestionItem = styled.li`
    padding: 8px;
    cursor: pointer;
    &:hover {
        background-color: #444;
    }
    a {
        color: #fff !important;
        text-decoration: none !important;
    }
`;

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    const { isAuthenticated, logout } = useAuth();
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (searchQuery.length > 0) {
            fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => setSuggestions(data))
                .catch(err => console.error("Lỗi khi lấy gợi ý:", err));
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    const handleSearchClick = () => {
        setSearchActive(prev => !prev);
        setSearchQuery("");
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            setSearchActive(false);
            setSearchQuery("");
            setSuggestions([]);
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleNavClick = (e, href) => {
        if ((href === '/account' || href === '/cart') && !isAuthenticated) {
            e.preventDefault();
            setShowModal(true);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            <StyledHeader>
                <Center>
                    <Wrapper>
                        <Logo href={'/'}>
                            <LogoImage src="images/original-removebg-preview.png" alt="Smber Logo" />
                            QuisK Shop
                        </Logo>
                        <StyledNav mobileNavActive={mobileNavActive}>
                            <NavLink href={'/'} onClick={(e) => handleNavClick(e, '/')} active={router.pathname === '/'}>Trang chủ</NavLink>
                            <NavLink href={'/products'} onClick={(e) => handleNavClick(e, '/products')} active={router.pathname === '/products'}>Sản phẩm</NavLink>
                            <NavLink href={'/categories'} onClick={(e) => handleNavClick(e, '/categories')} active={router.pathname === '/categories'}>Danh mục</NavLink>
                            <NavLink href={'/account'} onClick={(e) => handleNavClick(e, '/account')} active={router.pathname === '/account'}>Tài khoản</NavLink>
                            <NavLink href={'/cart'} onClick={(e) => handleNavClick(e, '/cart')} active={router.pathname === '/cart'}>
                                Giỏ hàng (<span id="cart-icon">{cartProducts.length}</span>)
                            </NavLink>
                            {isAuthenticated && (
                                <NavLink href={'#'} onClick={handleLogout} active={false}>Đăng xuất</NavLink>
                            )}
                        </StyledNav>
                        <SearchWrapper>
                            <SearchInputWrapper>
                                <SearchInput
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    autoFocus
                                />
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                            </SearchInputWrapper>
                            <SearchButton onClick={handleSearchClick} title="Tìm kiếm">
                                <SearchIcon />
                            </SearchButton>
                            {searchActive && (
                                <SearchInput
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    autoFocus
                                />
                            )}
                            {suggestions.length > 0 && (
                                <SuggestionsList>
                                    {suggestions.map(product => (
                                        <SuggestionItem key={product._id}>
                                            <Link href={`/products/${product._id}`} onClick={() => { setSearchActive(false); setSearchQuery(""); }}>
                                                {product.title}
                                            </Link>
                                        </SuggestionItem>
                                    ))}
                                </SuggestionsList>
                            )}
                        </SearchWrapper>
                        <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                            <BarsIcon />
                        </NavButton>
                    </Wrapper>
                </Center>
            </StyledHeader>
            {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}
        </>
    );
}