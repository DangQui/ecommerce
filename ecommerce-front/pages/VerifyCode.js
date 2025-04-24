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

const ResendLink = styled.a`
    color: #1a73e8;
    font-size: 14px;
    cursor: pointer;
    margin: 10px 0;
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

export default function VerifyCode() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const { email } = router.query;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) {
            setError('Vui lòng nhập mã xác thực');
            return;
        }

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await res.json();

            if (res.status === 200) {
                setSuccess('Xác thực thành công! Đăng ký hoàn tất.');
                setTimeout(() => router.push('/login'), 2000);
            } else if (data.error === 'Verification code has expired') {
                setError('Mã xác thực đã hết hạn, vui lòng yêu cầu mã mới');
            } else {
                setError(data.error || 'Mã xác thực không đúng');
            }
        } catch (error) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const handleResend = async () => {
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.status === 200) {
                setSuccess('Mã xác thực mới đã được gửi!');
            } else {
                setError('Không thể gửi lại mã, vui lòng thử lại');
            }
        } catch (error) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <Container>
            <Card>
                <Illustration>
                    <img src="/images/verify-illustration.png" alt="Hình minh họa xác thực" style={{ maxWidth: '100%' }} />
                </Illustration>
                <FormContainer>
                    <Logo>LOGO CỦA BẠN</Logo>
                    <Title>Xác Thực Mã</Title>
                    <Subtitle>Một mã xác thực đã được gửi đến email của bạn.</Subtitle>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            placeholder="Nhập mã xác thực"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError('');
                            }}
                            error={error}
                        />
                        {error && <ErrorText>{error}</ErrorText>}
                        {success && <SuccessText>{success}</SuccessText>}
                        <ResendLink onClick={handleResend}>Không nhận được mã? Gửi lại</ResendLink>
                        <Button type="submit">Xác thực</Button>
                    </form>
                </FormContainer>
            </Card>
        </Container>
    );
}