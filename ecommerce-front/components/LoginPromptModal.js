import styled from 'styled-components';
import { useRouter } from 'next/router';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
`;

const Modal = styled.div`
    background: white;
    border-radius: 10px;
    padding: 20px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
`;

const Logo = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
`;

const LogoImage = styled.img`
    width: 50px;
    height: 50px;
`;

const Message = styled.p`
    font-size: 14px;
    color: #333;
    margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    color: white;
    background-color: ${props => props.primary ? '#ff5733' : '#ddd'};
    &:hover {
        background-color: ${props => props.primary ? '#e64d2e' : '#ccc'};
    }
`;

export default function LoginPromptModal({ onClose }) {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
        onClose();
    };

    const handleRegister = () => {
        router.push('/register');
        onClose();
    };

    return (
        <Overlay>
            <Modal>
                <CloseButton onClick={onClose}>×</CloseButton>
                <Logo>
                    <LogoImage src="/images/smber-logo.png" alt="Smber Logo" />
                </Logo>
                <Message>
                    Vui lòng đăng nhập tài khoản Smember để xem ưu đãi và thanh toán để đăng ký hon.
                </Message>
                <ButtonWrapper>
                    <Button onClick={handleRegister}>Đăng ký</Button>
                    <Button primary onClick={handleLogin}>Đăng nhập</Button>
                </ButtonWrapper>
            </Modal>
        </Overlay>
    );
}