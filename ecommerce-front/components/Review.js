import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { primary } from '@/lib/colors';
import { useAuth } from '@/context/AuthContext';
import LoginPromptModal from '@/components/LoginPromptModal';

const ReviewsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 40px;
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ReviewSection = styled.div`
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ReviewTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 20px;
`;

const StarWrapper = styled.div`
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
`;

const Star = styled.span`
    font-size: 1.5rem;
    color: ${props => (props.filled ? '#FFD700' : '#ccc')};
    cursor: pointer;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;
    resize: vertical;
`;

const Button = styled.button`
    background-color: ${primary};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    &:hover {
        background-color: #1557b0;
    }
`;

const ReviewList = styled.div`
    max-height: 400px;
    overflow-y: auto;
`;

const ReviewItem = styled.div`
    border-bottom: 1px solid #eee;
    padding: 10px 0;
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
`;

const ReviewRating = styled.div`
    display: flex;
    gap: 5px;
`;

const ReviewDate = styled.span`
    color: #666;
    font-size: 0.9rem;
`;

const ReviewContent = styled.p`
    margin: 5px 0;
    color: #333;
`;

const ErrorText = styled.p`
    color: #ff0000;
    font-size: 0.9rem;
    margin-top: 5px;
`;

const Notification = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1002;
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    animation: slideDown 0.5s ease-in-out forwards, fadeOut 0.5s ease-in-out 4.5s forwards;

    @keyframes slideDown {
        0% {
            transform: translateY(-100%);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-100%);
        }
    }

    &:before {
        content: '✔';
        font-size: 1.2rem;
    }
`;

export default function Review({ productId }) {
    const { isAuthenticated, userEmail } = useAuth();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/${productId}`);
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            setError('Không thể tải đánh giá');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        if (!rating || !title || !content) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    user: userEmail,
                    rating,
                    title,
                    content,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setRating(0);
                setTitle('');
                setContent('');
                setError('');
                setShowSuccess(true);
                fetchReviews();
            } else {
                setError(data.error || 'Có lỗi xảy ra khi gửi đánh giá');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi gửi đánh giá: ' + err.message);
        }
    };

    return (
        <ReviewsWrapper>
            <ReviewSection>
                <ReviewTitle>Đánh giá sản phẩm</ReviewTitle>
                <form onSubmit={handleSubmitReview}>
                    <StarWrapper>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                filled={star <= rating}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </Star>
                        ))}
                    </StarWrapper>
                    <Input
                        type="text"
                        placeholder="Nhập chủ đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Nó có tốt không? Ưu điểm? Nhược điểm?"
                        rows="4"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {error && <ErrorText>{error}</ErrorText>}
                    <Button type="submit">Gửi đánh giá</Button>
                </form>
            </ReviewSection>
            <ReviewSection>
                <ReviewTitle>Tất cả đánh giá</ReviewTitle>
                <ReviewList>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewItem key={review._id}>
                                <ReviewHeader>
                                    <ReviewRating>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                filled={star <= review.rating}
                                            >
                                                ★
                                            </Star>
                                        ))}
                                    </ReviewRating>
                                    <ReviewDate>
                                        {new Date(review.createdAt).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false,
                                        })}
                                    </ReviewDate>
                                </ReviewHeader>
                                <ReviewContent>
                                    <strong>{review.title}</strong>
                                    <p>{review.content}</p>
                                    <p>
                                        Đánh giá bởi: {review.userFullName || 'Người dùng'} ({review.user})
                                    </p>
                                </ReviewContent>
                            </ReviewItem>
                        ))
                    ) : (
                        <p>Chưa có đánh giá nào.</p>
                    )}
                </ReviewList>
            </ReviewSection>

            {showLoginModal && (
                <LoginPromptModal onClose={() => setShowLoginModal(false)} />
            )}

            {showSuccess && (
                <Notification onAnimationEnd={() => setShowSuccess(false)}>
                    Đánh giá đã được gửi thành công!
                </Notification>
            )}
        </ReviewsWrapper>
    );
}