import { useState, useEffect } from 'react';
import styled from 'styled-components';
import EyeShowIcon from '../components/icon/EyeShow';
import EyeHiddenIcon from '../components/icon/EyeHidden';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Center from '../components/Center';
import axios from 'axios';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #eee;
    padding-top: 80px;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 10px;
    padding: 10px;
    @media screen and (max-width: 600px) {
        gap: 15px;
        padding: 8px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        gap: 25px;
        padding: 12px;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr 0.8fr;
        gap: 40px;
        padding: 20px;
        padding-left: 0;
    }
`;

const HistoryBox = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    order: 2;
    @media screen and (max-width: 600px) {
        padding: 12px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        padding: 15px;
    }
    @media screen and (min-width: 768px) {
        width: 500px;
        padding: 30px;
        order: 1;
    }
`;

const DetailBox = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    box-sizing: border-box; /* Đảm bảo padding không làm tăng chiều rộng */
    order: 1;
    @media screen and (max-width: 600px) {
        padding: 12px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        padding: 15px;
    }
    @media screen and (min-width: 768px) {
        width: 300px;
        padding: 30px;
        order: 2;
    }
`;

const Title = styled.h2`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: left;
    color: #000;
    @media screen and (max-width: 600px) {
        font-size: 20px;
        margin-bottom: 12px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        font-size: 22px;
        margin-bottom: 15px;
    }
    @media screen and (min-width: 768px) {
        font-size: 26px;
        margin-bottom: 20px;
    }
`;

const SectionTitle = styled.h2`
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0 10px;
    @media screen and (max-width: 600px) {
        font-size: 14px;
        margin: 12px 0 8px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        font-size: 15px;
        margin: 14px 0 9px;
    }
    @media screen and (min-width: 768px) {
        font-size: 18px;
        margin: 20px 0 10px;
    }
`;

const PasswordToggle = styled.div`
    font-size: 14px;
    color: #1a73e8;
    cursor: pointer;
    margin: 15px 0;
    &:hover {
        text-decoration: underline;
    }
    @media screen and (max-width: 600px) {
        font-size: 13px;
        margin: 12px 0;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        font-size: 14px;
        margin: 14px 0;
    }
    @media screen and (min-width: 768px) {
        font-size: 16px;
        margin: 20px 0;
    }
`;

const InputWrapper = styled.div`
    position: relative;
    margin: 8px 0;
    width: 100%; /* Đảm bảo không tràn */
    @media screen and (max-width: 600px) {
        margin: 6px 0;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        margin: 7px 0;
    }
    @media screen and (min-width: 768px) {
        margin: 10px 0;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    padding-right: ${props => props.type === 'password' ? '35px' : '8px'}; /* Giảm padding-right trên mobile */
    border: 1px solid ${props => props.error ? '#ff0000' : '#ddd'};
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box; /* Đảm bảo padding không làm tăng chiều rộng */
    &:focus {
        outline: none;
        border-color: ${props => props.error ? '#ff0000' : '#1a73e8'};
    }
    @media screen and (max-width: 600px) {
        padding: 6px;
        padding-right: ${props => props.type === 'password' ? '30px' : '6px'};
        font-size: 13px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        padding: 7px;
        padding-right: ${props => props.type === 'password' ? '32px' : '7px'};
        font-size: 13px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        padding-right: ${props => props.type === 'password' ? '40px' : '10px'};
    }
`;

const IconWrapper = styled.div`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    width: 20px; /* Giới hạn chiều rộng của icon */
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 600px) {
        right: 8px;
        width: 18px;
        height: 18px;
    }
`;

const ToggleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0;
    @media screen and (max-width: 600px) {
        margin: 12px 0;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        margin: 14px 0;
    }
    @media screen and (min-width: 768px) {
        margin: 20px 0;
    }
`;

const ToggleLabel = styled.label`
    font-size: 14px;
    color: #333;
    @media screen and (max-width: 600px) {
        font-size: 13px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        font-size: 13px;
    }
    @media screen and (min-width: 768px) {
        font-size: 16px;
    }
`;

const ToggleSwitch = styled.input`
    appearance: none;
    width: 50px;
    height: 24px;
    background-color: #ccc;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;

    &:checked {
        background-color: #1a73e8;
    }

    &:before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        transition: transform 0.3s;
    }

    &:checked:before {
        transform: translateX(26px);
    }
`;

const Button = styled.button`
    background-color: #1a73e8;
    color: white;
    padding: 8px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    margin-top: 15px;
    width: 100%;
    &:hover {
        background-color: #1557b0;
    }
    @media screen and (max-width: 600px) {
        padding: 6px;
        font-size: 13px;
        margin-top: 12px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        padding: 7px;
        font-size: 13px;
        margin-top: 14px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        font-size: 16px;
        margin-top: 20px;
    }
`;

const LogoutButton = styled.button`
    background-color: #1557b0;
    color: white;
    padding: 8px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    margin-top: 15px;
    width: 100%;
    &:hover {
        background-color: #0e3c7e;
    }
    @media screen and (max-width: 600px) {
        padding: 6px;
        font-size: 13px;
        margin-top: 12px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        padding: 7px;
        font-size: 13px;
        margin-top: 14px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        font-size: 16px;
        margin-top: 20px;
    }
`;

const ErrorText = styled.p`
    color: #ff0000;
    font-size: 12px;
    margin: 5px 0 0 0;
    @media screen and (max-width: 600px) {
        font-size: 11px;
    }
`;

const SuccessText = styled.p`
    color: green;
    font-size: 12px;
    margin: 8px 0;
    text-align: center;
    @media screen and (max-width: 600px) {
        font-size: 11px;
        margin: 6px 0;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        font-size: 12px;
        margin: 7px 0;
    }
    @media screen and (min-width: 768px) {
        font-size: 14px;
        margin: 10px 0;
    }
`;

const ProductInfoCell = styled.div`
    padding: 8px 0;
    @media screen and (max-width: 600px) {
        padding: 6px 0;
        font-size: 14px;
    }
    @media screen and (min-width: 601px) and (max-width: 767px) {
        padding: 7px 0;
        font-size: 14px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px 0;
        font-size: 16px;
    }
`;

const ProductInfoCellFlex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    @media screen and (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
    }
`;

export default function Account() {
    const { isAuthenticated, userEmail, logout } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        twoFactorEnabled: false,
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [orders, setOrders] = useState([]);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/account', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-email': userEmail || '',
                    },
                });
                const data = await res.json();
                if (res.status === 200) {
                    setUserData({
                        fullName: data.fullName,
                        email: data.email,
                        phone: data.phone,
                        birthDate: data.birthDate.split('T')[0],
                        twoFactorEnabled: data.twoFactorEnabled,
                    });
                } else {
                    setErrors({ general: 'Không thể tải thông tin, vui lòng thử lại' });
                }
            } catch (error) {
                setErrors({ general: 'Không thể tải thông tin, vui lòng thử lại' });
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đơn hàng:', error);
                setErrors({ general: 'Không thể tải lịch sử mua hàng, vui lòng thử lại' });
            }
        };

        fetchUserData();
        fetchOrders();
    }, [isAuthenticated, router, userEmail]);

    const validateInfoForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!userData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
        if (!userData.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!emailRegex.test(userData.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }
        if (!userData.phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!phoneRegex.test(userData.phone)) {
            newErrors.phone = 'Số điện thoại phải có đúng 10 chữ số';
        }
        if (!userData.birthDate) newErrors.birthDate = 'Vui lòng chọn ngày sinh';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!passwordData.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (!passwordRegex.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa và ký tự đặc biệt';
        }
        if (!passwordData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Vui lòng nhập lại mật khẩu mới';
        } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Mật khẩu nhập lại không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        if (!validateInfoForm()) return;

        try {
            const res = await fetch('/api/account', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': userEmail || '',
                },
                body: JSON.stringify({ type: 'info', ...userData }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setSuccess('Cập nhật thông tin thành công!');
                setErrors({});
            } else {
                setErrors({ general: data.error || 'Có lỗi xảy ra, vui lòng thử lại' });
            }
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        try {
            const res = await fetch('/api/account', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': userEmail || '',
                },
                body: JSON.stringify({ type: 'password', ...passwordData }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setSuccess('Thay đổi mật khẩu thành công!');
                setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
                setErrors({});
                setShowPasswordForm(false);
            } else {
                setErrors({ general: data.error || 'Có lỗi xảy ra, vui lòng thử lại' });
            }
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handleToggle2FA = async (e) => {
        const newValue = e.target.checked;
        try {
            const res = await fetch('/api/account', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': userEmail || '',
                },
                body: JSON.stringify({ type: 'toggle2FA', twoFactorEnabled: newValue }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setUserData(prev => ({ ...prev, twoFactorEnabled: newValue }));
                setSuccess(`Xác thực 2 bước đã được ${newValue ? 'bật' : 'tắt'}!`);
                setErrors({});
            } else {
                setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
            }
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/'); // Chuyển hướng đến trang chủ thay vì trang login
    };

    const handleChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'info') {
            setUserData(prev => ({ ...prev, [name]: value }));
        } else {
            setPasswordData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const userOrders = orders.filter(order => 
        order.email === userData.email && order.phoneNumber === userData.phone
    );

    if (!isAuthenticated) return null;

    return (
        <MainContainer>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <HistoryBox>
                        <Title>Lịch Sử Mua Hàng</Title>
                        {userOrders.length === 0 && <div style={{ fontSize: '14px' }}>Chưa có đơn hàng nào!</div>}
                        {userOrders.map(order => (
                            <div key={order._id} style={{ marginBottom: '15px', borderBottom: '1px solid #d1d5dc', paddingBottom: '15px' }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
                                    {(new Date(order.createdAt)).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(' ', ' ')}
                                </h3>
                                <ProductInfoCellFlex>
                                    <ProductInfoCell style={{ color: '#8b8888' }}>
                                        {order.name} <br />
                                        {order.email} <br />
                                        {order.streetAddres}, {order.city}, {order.postalCode}
                                    </ProductInfoCell>
                                    <ProductInfoCell style={{ marginTop: '10px' }}>
                                        {order.line_items.map((item, index) => (
                                            <div key={index}>
                                                {item.quantity} x {item.price_data.product_data.name}
                                            </div>
                                        ))}
                                    </ProductInfoCell>
                                </ProductInfoCellFlex>
                            </div>
                        ))}
                    </HistoryBox>

                    <DetailBox>
                        <Title>Thông Tin Tài Khoản</Title>
                        {success && <SuccessText>{success}</SuccessText>}
                        {errors.general && <ErrorText>{errors.general}</ErrorText>}

                        <SectionTitle>Thông Tin Cá Nhân</SectionTitle>
                        <form onSubmit={handleInfoSubmit}>
                            <InputWrapper>
                                <Input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    value={userData.fullName}
                                    onChange={(e) => handleChange(e, 'info')}
                                    error={errors.fullName}
                                />
                                {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
                            </InputWrapper>
                            <InputWrapper>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={userData.email}
                                    onChange={(e) => handleChange(e, 'info')}
                                    error={errors.email}
                                />
                                {errors.email && <ErrorText>{errors.email}</ErrorText>}
                            </InputWrapper>
                            <InputWrapper>
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    value={userData.phone}
                                    onChange={(e) => handleChange(e, 'info')}
                                    error={errors.phone}
                                />
                                {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                            </InputWrapper>
                            <InputWrapper>
                                <Input
                                    type="date"
                                    name="birthDate"
                                    value={userData.birthDate}
                                    onChange={(e) => handleChange(e, 'info')}
                                    error={errors.birthDate}
                                />
                                {errors.birthDate && <ErrorText>{errors.birthDate}</ErrorText>}
                            </InputWrapper>
                            <Button type="submit">Cập nhật thông tin</Button>
                        </form>

                        <SectionTitle>Đổi Mật Khẩu</SectionTitle>
                        <PasswordToggle onClick={() => setShowPasswordForm(!showPasswordForm)}>
                            {showPasswordForm ? 'Ẩn' : 'Đổi mật khẩu'}
                        </PasswordToggle>
                        {showPasswordForm && (
                            <form onSubmit={handlePasswordSubmit}>
                                <InputWrapper>
                                    <Input
                                        type={showOldPassword ? 'text' : 'password'}
                                        name="oldPassword"
                                        placeholder="Mật khẩu cũ"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => handleChange(e, 'password')}
                                        error={errors.oldPassword}
                                    />
                                    <IconWrapper onClick={() => setShowOldPassword(!showOldPassword)}>
                                        {showOldPassword ? <EyeHiddenIcon /> : <EyeShowIcon />}
                                    </IconWrapper>
                                    {errors.oldPassword && <ErrorText>{errors.oldPassword}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        placeholder="Mật khẩu mới"
                                        value={passwordData.newPassword}
                                        onChange={(e) => handleChange(e, 'password')}
                                        error={errors.newPassword}
                                    />
                                    <IconWrapper onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <EyeHiddenIcon /> : <EyeShowIcon />}
                                    </IconWrapper>
                                    {errors.newPassword && <ErrorText>{errors.newPassword}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmNewPassword"
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={passwordData.confirmNewPassword}
                                        onChange={(e) => handleChange(e, 'password')}
                                        error={errors.confirmNewPassword}
                                    />
                                    <IconWrapper onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeHiddenIcon /> : <EyeShowIcon />}
                                    </IconWrapper>
                                    {errors.confirmNewPassword && <ErrorText>{errors.confirmNewPassword}</ErrorText>}
                                </InputWrapper>
                                <Button type="submit">Thay đổi mật khẩu</Button>
                            </form>
                        )}

                        <SectionTitle>Xác Thực 2 Bước</SectionTitle>
                        <ToggleWrapper>
                            <ToggleLabel>Trạng thái: {userData.twoFactorEnabled ? 'Đang bật' : 'Đang tắt'}</ToggleLabel>
                            <ToggleSwitch
                                type="checkbox"
                                checked={userData.twoFactorEnabled}
                                onChange={handleToggle2FA}
                            />
                        </ToggleWrapper>

                        <LogoutButton onClick={handleLogout}>Đăng xuất</LogoutButton>
                    </DetailBox>
                </ColumnsWrapper>
            </Center>
        </MainContainer>
    );
}