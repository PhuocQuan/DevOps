import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Comments = ({ productId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${productId}`);
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    if (savedComments) {
      const parsedComments = JSON.parse(savedComments);
      setComments(parsedComments);
      
      if (loggedInStatus) {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const { username } = JSON.parse(userData);
          setUserName(username);
          const existingComment = parsedComments.find(c => c.userName === username);
          if (existingComment) {
            setUserComment(existingComment);
            setNewComment(existingComment.text);
            setRating(existingComment.rating);
          }
        }
      }
    }
  }, [productId]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (!isLoggedIn) {
      if (window.confirm('Vui lòng đăng nhập để đánh giá!')) {
        localStorage.setItem('returnUrl', location.pathname);
        navigate('/login');
      }
      return;
    }

    if (rating > 0) {
      let updatedComments;
      const newCommentObj = {
        id: userComment ? userComment.id : Date.now(),
        text: newComment.trim(),
        rating: rating,
        userName: userName,
        date: new Date().toLocaleDateString()
      };

      if (isEditing) {
        updatedComments = comments.map(c => 
          c.id === userComment.id ? newCommentObj : c
        );
      } else {
        updatedComments = [...comments, newCommentObj];
      }

      setComments(updatedComments);
      localStorage.setItem(`comments_${productId}`, JSON.stringify(updatedComments));
      
      setNewComment('');
      setRating(0);
      setIsEditing(false);
      setUserComment(newCommentObj);
    } else {
      alert('Vui lòng chọn số sao đánh giá!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewComment(userComment.text);
    setRating(userComment.rating);
  };

  const handleClearAllComments = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả đánh giá?')) {
      localStorage.removeItem(`comments_${productId}`);
      setComments([]);
      setUserComment(null);
      setNewComment('');
      setRating(0);
      setIsEditing(false);
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Đánh giá & Bình luận</h3>
        {localStorage.getItem('isAdmin') === 'true' && (
          <button onClick={handleClearAllComments} className="clear-comments">
            Xóa tất cả đánh giá
          </button>
        )}
      </div>
      
      {isLoggedIn ? (
        !userComment || isEditing ? (
          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      size={25}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="comment-input"
            />
            <button type="submit" className="submit-comment">
              {isEditing ? 'Cập nhật' : 'Gửi'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                className="cancel-edit" 
                onClick={() => {
                  setIsEditing(false);
                  setNewComment('');
                  setRating(0);
                }}
              >
                Hủy
              </button>
            )}
          </form>
        ) : (
          <div className="user-comment-actions">
            <p>Bạn đã đánh giá sản phẩm này</p>
            <button onClick={handleEdit} className="edit-comment">
              <FaEdit /> Sửa đánh giá
            </button>
          </div>
        )
      ) : (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className="star"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    size={25}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="comment-input"
          />
          <button type="submit" className="submit-comment">Gửi</button>
        </form>
      )}
      
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="user-name">{comment.userName}</span>
              <div className="star-display">
                {[...Array(5)].map((star, index) => (
                  <FaStar
                    key={index}
                    color={index < comment.rating ? "#ffc107" : "#e4e5e9"}
                    size={15}
                  />
                ))}
              </div>
            </div>
            {comment.text && (
              <p className="comment-text">{comment.text}</p>
            )}
            <small className="comment-date">{comment.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments; 