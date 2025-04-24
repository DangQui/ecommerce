import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EyeShowIcon from '../components/icon/EyeShow';
import EyeHiddenIcon from '../components/icon/EyeHidden';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f5f7fa;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const Card = styled.div`
    display: flex;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 900px;
    width: 100%;
`;

const Illustration = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    padding: 20px;
    @media (max-width: 768px) {
        display: none;
    }
`;

const FormContainer = styled.div`
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #1a73e8;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Subtitle = styled.p`
    color: #666;
    margin-bottom: 20px;
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

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
`;

const Checkbox = styled.input`
    margin-right: 10px;
`;

const Label = styled.label`
    color: #666;
    font-size: 14px;
`;

const ForgotLink = styled.a`
    color: #1a73e8;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
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
    &:hover {
        background-color: #1557b0;
    }
`;

const LinkText = styled.p`
    text-align: center;
    margin-top: 20px;
    color: #666;
    a {
        color: #1a73e8;
        text-decoration: none;
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
    margin: 5px 0 0 0;
`;

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
        rememberMe: false,
    });
    const [twoFAData, setTwoFAData] = useState({
        code: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const validateForm = () => {
        const newErrors = {};
        const emailPhoneRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|\d{10})$/;

        if (!formData.emailOrPhone) {
            newErrors.emailOrPhone = 'Vui lòng nhập email hoặc số điện thoại';
        } else if (!emailPhoneRegex.test(formData.emailOrPhone)) {
            newErrors.emailOrPhone = 'Email hoặc số điện thoại không đúng định dạng';
        }
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validate2FAForm = () => {
        const newErrors = {};
        if (!twoFAData.code) {
            newErrors.code = 'Vui lòng nhập mã xác thực';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailOrPhone: formData.emailOrPhone,
                    password: formData.password,
                }),
            });
            const data = await res.json();

            if (res.status === 200) {
                if (data.requires2FA) {
                    setTwoFAData({ ...twoFAData, email: data.email });
                    setStep(2);
                    setSuccess('Mã xác thực đã được gửi đến email của bạn');
                } else {
                    login(data.email);
                    router.push('/');
                }
            } else {
                setErrors({ general: data.error || 'Email hoặc mật khẩu không đúng' });
            }
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handle2FASubmit = async (e) => {
        e.preventDefault();
        if (!validate2FAForm()) return;

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: twoFAData.email, code: twoFAData.code, type: '2fa-login' }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setSuccess('Xác thực thành công! Đăng nhập hoàn tất.');
                login(twoFAData.email);
                setTimeout(() => router.push('/'), 2000);
            } else if (data.error === 'Mã xác thực đã hết hạn') {
                setErrors({ code: 'Mã xác thực đã hết hạn, vui lòng yêu cầu mã mới' });
            } else {
                setErrors({ code: data.error || 'Mã xác thực không đúng' });
            }
        } catch (error) {
            setErrors({ code: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handleChange = (e, formType) => {
        const { name, value, type, checked } = e.target;
        if (formType === 'login') {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        } else {
            setTwoFAData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Container>
            <Card>
                <Illustration>
                    <img src="/images/login-illustration.png" alt="Hình minh họa đăng nhập" style={{ maxWidth: '100%' }} />
                </Illustration>
                <FormContainer>
                    <Logo>LOGO CỦA BẠN</Logo>
                    {step === 1 ? (
                        <>
                            <Title>Đăng Nhập</Title>
                            <Subtitle>Đăng nhập để truy cập tài khoản của bạn</Subtitle>
                            <form onSubmit={handleLoginSubmit}>
                                <InputWrapper>
                                    <Input
                                        type="text"
                                        name="emailOrPhone"
                                        placeholder="Email hoặc số điện thoại"
                                        value={formData.emailOrPhone}
                                        onChange={(e) => handleChange(e, 'login')}
                                        error={errors.emailOrPhone}
                                    />
                                    {errors.emailOrPhone && <ErrorText>{errors.emailOrPhone}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Mật khẩu"
                                        value={formData.password}
                                        onChange={(e) => handleChange(e, 'login')}
                                        error={errors.password}
                                    />
                                    <IconWrapper onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeHiddenIcon /> : <EyeShowIcon />}
                                    </IconWrapper>
                                    {errors.password && <ErrorText>{errors.password}</ErrorText>}
                                </InputWrapper>
                                <CheckboxContainer>
                                    <div>
                                        <Checkbox
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={(e) => handleChange(e, 'login')}
                                        />
                                        <Label>Ghi nhớ tôi</Label>
                                    </div>
                                    <ForgotLink href="/forgot-password">Quên mật khẩu?</ForgotLink>
                                </CheckboxContainer>
                                {errors.general && <ErrorText>{errors.general}</ErrorText>}
                                <Button type="submit">Đăng nhập</Button>
                            </form>
                            <LinkText>
                                Bạn chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
                            </LinkText>
                        </>
                    ) : (
                        <>
                            <Title>Xác Thực 2 Bước</Title>
                            <Subtitle>Mã xác thực đã được gửi đến email của bạn</Subtitle>
                            <form onSubmit={handle2FASubmit}>
                                <InputWrapper>
                                    <Input
                                        type="text"
                                        name="code"
                                        placeholder="Nhập mã xác thực"
                                        value={twoFAData.code}
                                        onChange={(e) => handleChange(e, '2fa')}
                                        error={errors.code}
                                    />
                                    {errors.code && <ErrorText>{errors.code}</ErrorText>}
                                </InputWrapper>
                                {success && <SuccessText>{success}</SuccessText>}
                                <Button type="submit">Xác thực</Button>
                            </form>
                        </>
                    )}
                </FormContainer>
            </Card>
        </Container>
    );
}