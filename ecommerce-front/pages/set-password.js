import { useState } from 'react';
import styled from 'styled-components';
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

const LogoImage = styled.img`
    width: 50px;
    height: 50px;
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
    padding-right: 40px;
    border: 1px solid ${props => props.error ? '#ff0000' : '#ddd'};
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box;
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
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
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

export default function SetPassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const { email } = router.query;

    const validateForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!formData.password) {
            newErrors.password = 'Yêu cầu không bỏ trống';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa và ký tự đặc biệt';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Yêu cầu không bỏ trống';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch('/api/set-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: formData.password }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setSuccess('Mật khẩu đã được đặt lại thành công!');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setErrors({ general: data.error || 'Có lỗi xảy ra, vui lòng thử lại' });
            }
        } catch (error) {
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Container>
            <Card>
                <Illustration>
                    <img src="/images/set-password.png" alt="Hình minh họa đặt mật khẩu" style={{ maxWidth: '100%' }} />
                </Illustration>
                <FormContainer>
                    <Logo>
                        <LogoImage src="/images/original.png" alt="Smber Logo" />
                        QuisK Shop
                    </Logo>
                    <Title>Đặt Lại Mật Khẩu</Title>
                    <Subtitle>Nhập mật khẩu mới cho tài khoản của bạn</Subtitle>
                    <form onSubmit={handleSubmit}>
                        <InputWrapper>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Mật khẩu mới"
                                value={formData.password}
                                onChange={handleChange}
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
                                placeholder="Xác nhận mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                            />
                            <IconWrapper onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeHiddenIcon /> : <EyeShowIcon />}
                            </IconWrapper>
                            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                        </InputWrapper>
                        {errors.general && <ErrorText>{errors.general}</ErrorText>}
                        {success && <SuccessText>{success}</SuccessText>}
                        <Button type="submit">Xác nhận</Button>
                    </form>
                </FormContainer>
            </Card>
        </Container>
    );
}