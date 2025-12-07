import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Loader2, ArrowLeft, User, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Comment {
    id: number;
    content: string;
    user_id: string;
    created_at: string;
    user: {
        id: string;
        name: string;
        avatar_url: string | null;
    };
    likes: any[];
    replies?: Comment[];
}

interface Topic {
    id: number;
    title: string;
    description: string | null;
    user_id: string;
    article_id: number | null;
    created_at: string;
    user: {
        id: string;
        name: string;
        avatar_url: string | null;
    };
    article?: {
        id: number;
        title: string;
    };
    comments: Comment[];
}

export default function TopicDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTopic();
    }, [id]);

    const fetchTopic = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get<Topic>(`/topics/${id}`);
            setTopic(response.data);
        } catch (err: any) {
            console.error('Error fetching topic:', err);
            setError(err.response?.data?.message || 'Error al cargar el tema');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            setSubmitting(true);
            const response = await api.post(`/topics/${id}/comments`, {
                content: newComment,
            });

            // Add new comment to the list
            if (topic) {
                setTopic({
                    ...topic,
                    comments: [response.data, ...topic.comments],
                });
            }
            setNewComment('');
        } catch (err: any) {
            console.error('Error posting comment:', err);
            alert(err.response?.data?.message || 'Error al publicar el comentario');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId: number) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/comments/${commentId}/likes`);
            // Refresh topic to get updated likes
            fetchTopic();
        } catch (err: any) {
            console.error('Error toggling like:', err);
        }
    };

    const getAvatarUrl = (user: Topic['user']) => {
        return user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=200`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !topic) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900">Error al cargar el tema</h3>
                <p className="mt-2 text-gray-600">{error}</p>
                <Link
                    to="/topics"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al foro
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <Link
                to="/topics"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al foro
            </Link>

            {/* Topic Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{topic.title}</h1>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={getAvatarUrl(topic.user)}
                        alt={topic.user.name}
                        className="h-12 w-12 rounded-full"
                    />
                    <div>
                        <p className="font-medium text-gray-900">{topic.user.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                                {formatDistanceToNow(new Date(topic.created_at), {
                                    addSuffix: true,
                                    locale: es,
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {topic.description && (
                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{topic.description}</p>
                    </div>
                )}

                {/* Related Article */}
                {topic.article && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">📰 Artículo relacionado:</p>
                        <Link
                            to={`/articles/${topic.article_id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {topic.article.title}
                        </Link>
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2" />
                    Discusión ({topic.comments.length})
                </h2>

                {/* Comment Form */}
                {user ? (
                    <form onSubmit={handleSubmitComment} className="mb-8">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe tu comentario..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <div className="mt-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {submitting ? 'Publicando...' : 'Publicar Comentario'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                        <p className="text-gray-600">
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Inicia sesión
                            </Link>{' '}
                            para participar en la discusión
                        </p>
                    </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                    {topic.comments.length > 0 ? (
                        topic.comments.map((comment) => (
                            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={getAvatarUrl(comment.user)}
                                        alt={comment.user.name}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{comment.user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDistanceToNow(new Date(comment.created_at), {
                                                        addSuffix: true,
                                                        locale: es,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                        <div className="mt-3 flex items-center space-x-4">
                                            <button
                                                onClick={() => handleLike(comment.id)}
                                                className={`flex items-center space-x-1 text-sm ${comment.likes.some((like: any) => like.user_id === user?.id)
                                                        ? 'text-red-600'
                                                        : 'text-gray-500 hover:text-red-600'
                                                    } transition-colors`}
                                            >
                                                <span>{comment.likes.some((like: any) => like.user_id === user?.id) ? '❤️' : '🤍'}</span>
                                                <span>{comment.likes.length}</span>
                                            </button>
                                        </div>

                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-4 ml-8 space-y-4">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="flex items-start space-x-3">
                                                        <img
                                                            src={getAvatarUrl(reply.user)}
                                                            alt={reply.user.name}
                                                            className="h-8 w-8 rounded-full"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900 text-sm">{reply.user.name}</p>
                                                            <p className="text-sm text-gray-700 mt-1">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            No hay comentarios aún. ¡Sé el primero en comentar!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
