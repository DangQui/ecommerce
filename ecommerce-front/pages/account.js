import { useState, useEffect } from 'react';
import styled from 'styled-components';
import EyeShowIcon from '../components/icon/EyeShow';
import EyeHiddenIcon from '../components/icon/EyeHidden';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Header from '../components/Header'; // Import Header.js

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px 20px 20px; /* Thêm padding-top để không bị che bởi Header */
    flex: 1;
`;

const Card = styled.div`
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 40px;
    max-width: 600px;
    width: 100%;
    position: relative;
`;

const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #1a73e8;
    &:hover {
        color: #1557b0;
    }
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0 10px;
`;

const PasswordToggle = styled.div`
    font-size: 16px;
    color: #1a73e8;
    cursor: pointer;
    margin: 20px 0;
    &:hover {
        text-decoration: underline;
    }
`;

const InputWrapper = styled.div`
    position: relative;
    margin: 10px 0;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid ${props => props.error ? '#ff0000' : '#ddd'};
    border-radius: 5px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: ${props => props.error ? '#ff0000' : '#1a73e8'};
    }
`;

const IconWrapper = styled.div`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
`;

const ToggleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
`;

const ToggleLabel = styled.label`
    font-size: 16px;
    color: #333;
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
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    &:hover {
        background-color: #1557b0;
    }
`;

const ErrorText = styled.p`
    color: #ff0000;
    font-size: 12px;
    margin: 5px 0 0 0;
`;

const SuccessText = styled.p`
    color: green;
    font-size: 14px;
    margin: 10px 0;
    text-align: center;
`;

export default function Account() {
    const { isAuthenticated, userEmail } = useAuth();
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
        fetchUserData();
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
                setErrors({ general: data.error || 'Có lỗi xảy ra, vui lòng thử lại' });
            }
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handleBack = () => {
        router.back();
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

    if (!isAuthenticated) return null;

    return (
        <MainContainer>
            <Header />
            <Container>
                <Card>
                    <BackButton onClick={handleBack}>←</BackButton>
                    <Title>Quản Lý Tài Khoản</Title>
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
                </Card>
            </Container>
        </MainContainer>
    );
}