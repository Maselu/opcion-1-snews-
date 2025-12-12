import { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Heart, MessageCircle, Trash2, Edit2, X, Check } from 'lucide-react';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: number, authorName: string) => void;
    onDelete: (commentId: number) => void;
    onEdit: (commentId: number, newContent: string) => void;
}

export default function CommentItem({ comment, onReply, onDelete, onEdit }: CommentItemProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(comment.likes?.some(l => l.user_id === user?.id) || false);
    const [likesCount, setLikesCount] = useState(Math.max(0, comment.likes?.length || 0));
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const handleLike = async () => {
        if (!user) return;
        try {
            const { data } = await api.post(`/comments/${comment.id}/likes`);
            setLiked(data.liked);
            // Asegúrese de que los "me gusta" nunca se vuelvan negativos
            setLikesCount(prev => Math.max(0, data.liked ? prev + 1 : prev - 1));
        } catch (error) {
            console.error('Error toggling like', error);
        }
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) return;
        try {
            await onEdit(comment.id, editContent);
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing comment', error);
        }
    };

    const handleCancelEdit = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    return (
        <div className="flex space-x-3 py-4">
            <div className="flex-shrink-0">
                <img
                    className="h-10 w-10 rounded-full"
                    src={comment.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'User')}&background=random`}
                    alt=""
                />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{comment.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                        </p>
                        {comment.edited_at && (
                            <span className="text-xs text-gray-400 italic">(editado)</span>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 resize-none"
                            rows={3}
                        />
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={handleSaveEdit}
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                                <Check className="h-3 w-3 mr-1" />
                                Guardar
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                )}

                {!isEditing && (
                    <div className="flex items-center space-x-4 mt-2">
                        <button
                            onClick={handleLike}
                            className={`flex items-center text-sm ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                            {likesCount}
                        </button>

                        {user && (
                            <button
                                onClick={() => onReply(comment.id, comment.user?.name || 'Usuario')}
                                className="flex items-center text-sm text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Responder
                            </button>
                        )}

                        {user?.id === comment.user_id && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center text-sm text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    className="flex items-center text-sm text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Eliminar
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Respuestas recursivas */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 mt-4 border-l-2 border-gray-100">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
