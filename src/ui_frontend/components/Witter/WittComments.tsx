import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './WittComments.css';

export interface WittComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export interface WittCommentsProps {
  wittId: string;
  comments: WittComment[];
  onAddComment?: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, content: string) => void;
}

export const WittComments: React.FC<WittCommentsProps> = ({
  wittId,
  comments = [],
  onAddComment,
  onLikeComment,
  onReplyToComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (onLikeComment) {
      onLikeComment(commentId);
    }
  };

  return (
    <div className="witt-comments">
      <div className="comments-header">
        <button 
          className="toggle-comments-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form className="add-comment-form" onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
              rows={2}
            />
            <button 
              type="submit" 
              className="submit-comment-btn"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </form>

          <div className="comments-list">
            {comments && comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  {comment.authorAvatar || '👤'}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-timestamp">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="comment-text">{comment.content}</div>
                  <div className="comment-actions">
                    <button 
                      className={`comment-like-btn ${comment.isLiked ? 'liked' : ''}`}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      ❤️ {comment.likes}
                    </button>
                    <button className="comment-reply-btn">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};