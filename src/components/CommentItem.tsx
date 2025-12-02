import { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../hooks/useAuth';
//import { formatDistanceToNow } from 'date-fns'; // I might need to install date-fns or use native Intl
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import api from '../services/api';

interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: number) => void;
    onDelete: (commentId: number) => void;
}

export default function CommentItem({ comment, onReply, onDelete }: CommentItemProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(comment.likes?.some(l => l.user_id === user?.id) || false);
    const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);

    const handleLike = async () => {
        if (!user) return;
        try {
            const { data } = await api.post(`/comments/${comment.id}/likes`);
            setLiked(data.liked);
            setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error('Error toggling like', error);
        }
    };

    return (
        <div className="flex space-x-3 py-4">
            <div className="flex-shrink-0">
                <img
                    className="h-10 w-10 rounded-full"
                    src={comment.user?.avatar_url || `https://ui-avatars.com/api/?name=${comment.user?.name || 'User'}`}
                    alt=""
                />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{comment.user?.name || 'Unknown User'}</h3>
                    <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-gray-500">{comment.content}</p>

                <div className="flex items-center space-x-4 mt-2">
                    <button
                        onClick={handleLike}
                        className={`flex items-center text-sm ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                        {likesCount}
                    </button>

                    <button
                        onClick={() => onReply(comment.id)}
                        className="flex items-center text-sm text-gray-400 hover:text-gray-600"
                    >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                    </button>

                    {user?.id === comment.user_id && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="flex items-center text-sm text-gray-400 hover:text-red-600"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </button>
                    )}
                </div>

                {/* Recursive replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 mt-4 border-l-2 border-gray-100">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
