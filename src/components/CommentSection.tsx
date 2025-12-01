import { useState } from 'react';
import { MessageSquare, Reply, Edit2, Trash2 } from 'lucide-react';
import { LikeButton } from './LikeButton';
import { Comment } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment?: (content: string, parentId?: number) => void;
  onEditComment?: (commentId: number, content: string) => void;
  onDeleteComment?: (commentId: number) => void;
}

function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: {
  comment: Comment;
  onReply?: (commentId: number, content: string) => void;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
  depth?: number;
}) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply?.(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim()) {
      onEdit?.(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  const isOwner = user?.id === comment.user_id;

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'} animate-fade-in`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          {comment.user?.avatar_url ? (
            <img
              src={comment.user.avatar_url}
              alt={comment.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-secondary-900">
                  {comment.user?.name || 'Anonymous'}
                </span>
                <span className="text-xs text-secondary-500">{timeAgo(comment.created_at)}</span>
                {comment.is_edited && (
                  <span className="text-xs text-secondary-500 italic">(edited)</span>
                )}
              </div>

              {isOwner && !isEditing && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-secondary-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(comment.id)}
                    className="p-1 text-secondary-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button onClick={handleEdit} className="btn-primary text-sm">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-secondary-700 whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-2 ml-2">
            <LikeButton
              commentId={comment.id}
              initialLiked={comment.is_liked}
              initialCount={comment.likes_count || 0}
            />

            {user && depth < 3 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="inline-flex items-center space-x-1 text-secondary-600 hover:text-primary-600 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span className="text-sm font-medium">Reply</span>
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-4 animate-slide-in">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={3}
              />
              <div className="flex space-x-2 mt-2">
                <button onClick={handleReply} className="btn-primary text-sm">
                  Reply
                </button>
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentSection({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment);
      setNewComment('');
    }
  };

  const handleReply = (parentId: number, content: string) => {
    onAddComment?.(content, parentId);
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else {
      return (b.likes_count || 0) - (a.likes_count || 0);
    }
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-secondary-900">
            Comments ({comments.length})
          </h2>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
          className="px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Liked</option>
        </select>
      </div>

      {user ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-secondary-50 rounded-lg text-center">
          <p className="text-secondary-600">
            Please sign in to join the discussion and post comments.
          </p>
          <button className="btn-primary mt-3">Sign In</button>
        </div>
      )}

      <div className="space-y-6">
        {sortedComments
          .filter((comment) => !comment.parent_comment_id)
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
            />
          ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-600">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
