import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

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

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid ${props => props.error ? '#ff0000' : '#ddd'};
    border-radius: 5px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: ${props => props.error ? '#ff0000' : '#1a73e8'};
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

export default function ForgotPassword() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const validateForm = () => {
        const emailPhoneRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|\d{10})$/;
        if (!emailOrPhone) {
            setError('Yêu cầu không bỏ trống');
            return false;
        } else if (!emailPhoneRegex.test(emailOrPhone)) {
            setError('Email hoặc số điện thoại không đúng định dạng');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setSuccess('Mã xác thực đã được gửi đến email của bạn.');
                setTimeout(() => {
                    router.push(`/VerifyCode?email=${data.email}&type=forgot-password`);
                }, 2000);
            } else {
                setError(data.error || 'Email hoặc số điện thoại không tồn tại');
            }
        } catch (error) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <Container>
            <Card>
                <Illustration>
                    <img src="images/lock-forgot-password-removebg-preview.png" alt="Hình minh họa quên mật khẩu" style={{ maxWidth: '100%' }} />
                </Illustration>
                <FormContainer>
                    <Logo>
                        <LogoImage src="/images/original.png" alt="Smber Logo" />
                        QuisK Shop
                    </Logo>
                    <Title>Quên Mật Khẩu?</Title>
                    <Subtitle>Nhập email hoặc số điện thoại để nhận mã xác thực</Subtitle>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            placeholder="Email hoặc số điện thoại"
                            value={emailOrPhone}
                            onChange={(e) => {
                                setEmailOrPhone(e.target.value);
                                setError('');
                            }}
                            error={error}
                        />
                        {error && <ErrorText>{error}</ErrorText>}
                        {success && <SuccessText>{success}</SuccessText>}
                        <Button type="submit">Gửi</Button>
                    </form>
                </FormContainer>
            </Card>
        </Container>
    );
}