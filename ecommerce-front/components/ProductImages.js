import styled from "styled-components";
import { useState, useEffect } from "react";

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
`;

const BigImage = styled.img`
    max-width: 100%;
    max-height: 200px;
`;

const ImageButtons = styled.div`
    display: flex;
    gap: 10px;
    flex-grow: 0;
    margin-top: 10px;
`;

const ImageButton = styled.div`
    border: 2px solid #ccc;
    ${props => props.active ? `
        border-color: #ccc;
    ` : `
        border-color: transparent;
    `}
    height: 40px;
    padding: 2px;
    cursor: pointer;
    border-radius: 5px;
`;

const BigImageWrapper = styled.div`
    text-align: center;
`;

export default function ProductImages({ images }) {
    const [activeImage, setActiveImage] = useState("");

    // Sử dụng useEffect để cập nhật activeImage khi images thay đổi
    useEffect(() => {
        if (images && images.length > 0) {
            setActiveImage(images[0]); // Đặt ảnh đầu tiên làm ảnh lớn mặc định
        } else {
            setActiveImage(""); // Nếu không có ảnh, để trống
        }
    }, [images]); // Chạy lại khi images thay đổi

    return (
        <>
            <BigImageWrapper>
                {activeImage ? (
                    <BigImage src={activeImage} alt="Main product image" />
                ) : (
                    <div>Không có ảnh</div> // Hiển thị thông báo nếu không có ảnh
                )}
            </BigImageWrapper>
            <ImageButtons>
                {images && images.length > 0 ? (
                    images.map((image, index) => (
                        <ImageButton 
                            key={index}
                            active={image === activeImage}
                            onClick={() => setActiveImage(image)}>
                            <Image src={image} alt={`Product image ${index + 1}`} />
                        </ImageButton>
                    ))
                ) : (
                    <div>Không có ảnh để hiển thị</div> // Thông báo nếu không có ảnh trong danh sách
                )}
            </ImageButtons>
        </>
    );
}