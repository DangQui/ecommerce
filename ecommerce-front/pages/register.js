import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EyeShowIcon from '../components/icon/EyeShow';
import EyeHiddenIcon from '../components/icon/EyeHidden';

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

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        password: '',
        confirmPassword: '',
    });
    const [step, setStep] = useState(1);
    const [verificationData, setVerificationData] = useState({
        email: '',
        code: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }
        if (!formData.phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại phải có đúng 10 chữ số';
        }
        if (!formData.birthDate) newErrors.birthDate = 'Vui lòng chọn ngày sinh';
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa và ký tự đặc biệt';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateVerificationForm = () => {
        const newErrors = {};
        if (!verificationData.code) {
            newErrors.code = 'Vui lòng nhập mã xác thực';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.status === 200) {
                setVerificationData({ ...verificationData, email: formData.email });
                setStep(2);
                setSuccess('Mã xác thực đã được gửi đến email của bạn');
            } else {
                setErrors({ general: data.error || 'Có lỗi xảy ra, vui lòng thử lại' });
            }
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        if (!validateVerificationForm()) return;

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: verificationData.email, code: verificationData.code, type: 'registration' }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setSuccess('Xác thực thành công! Tài khoản đã được tạo. Chuyển hướng đến đăng nhập...');
                setTimeout(() => router.push('/login'), 2000);
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
        const { name, value } = e.target;
        if (formType === 'register') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setVerificationData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Container>
            <Card>
                <Illustration>
                    <img src="/images/register-illustration.png" alt="Hình minh họa đăng ký" style={{ maxWidth: '100%' }} />
                </Illustration>
                <FormContainer>
                    <Logo>LOGO CỦA BẠN</Logo>
                    {step === 1 ? (
                        <>
                            <Title>Đăng Ký</Title>
                            <Subtitle>Tạo tài khoản để bắt đầu mua sắm</Subtitle>
                            <form onSubmit={handleRegisterSubmit}>
                                <InputWrapper>
                                    <Input
                                        type="text"
                                        name="fullName"
                                        placeholder="Họ và tên"
                                        value={formData.fullName}
                                        onChange={(e) => handleChange(e, 'register')}
                                        error={errors.fullName}
                                    />
                                    {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => handleChange(e, 'register')}
                                        error={errors.email}
                                    />
                                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        placeholder="Số điện thoại"
                                        value={formData.phone}
                                        onChange={(e) => handleChange(e, 'register')}
                                        error={errors.phone}
                                    />
                                    {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={(e) => handleChange(e, 'register')}
                                        error={errors.birthDate}
                                    />
                                    {errors.birthDate && <ErrorText>{errors.birthDate}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Mật khẩu"
                                        value={formData.password}
                                        onChange={(e) => handleChange(e, 'register')}
                                        error={errors.password}
                                    />
                                    <IconWrapper onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeHiddenIcon /> : <EyeShowIcon />}
                                    </IconWrapper>
                                    {errors.password && <ErrorText>{errors.password}</ErrorText>}
                                </InputWrapper>
                                <InputWrapper>
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Nhập lại mật khẩu"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange(e, 'register')}
                                        error={errors.confirmPassword}
                                    />
                                    <IconWrapper onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeHiddenIcon /> : <EyeShowIcon />}
                                    </IconWrapper>
                                    {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                                </InputWrapper>
                                {errors.general && <ErrorText>{errors.general}</ErrorText>}
                                <Button type="submit">Đăng ký</Button>
                            </form>
                            <LinkText>
                                Bạn đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link>
                            </LinkText>
                        </>
                    ) : (
                        <>
                            <Title>Xác Thực Email</Title>
                            <Subtitle>Mã xác thực đã được gửi đến email của bạn</Subtitle>
                            <form onSubmit={handleVerificationSubmit}>
                                <InputWrapper>
                                    <Input
                                        type="text"
                                        name="code"
                                        placeholder="Nhập mã xác thực"
                                        value={verificationData.code}
                                        onChange={(e) => handleChange(e, 'verify')}
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