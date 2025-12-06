import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Loader2, MessageSquare, User, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Topic {
    id: number;
    title: string;
    description: string | null;
    user_id: string;
    article_id: number | null;
    created_at: string;
    comments_count: number;
    user: {
        id: string;
        name: string;
        avatar_url: string | null;
    };
    article?: {
        id: number;
        title: string;
    };
}

interface PaginatedResponse {
    data: Topic[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function TopicList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get<PaginatedResponse>('/topics');

            // Handle paginated response
            if (response.data.data) {
                setTopics(response.data.data);
            } else {
                // Handle non-paginated response (just in case)
                setTopics(response.data as any);
            }
        } catch (err: any) {
            console.error('Error fetching topics:', err);
            setError(err.response?.data?.message || 'Error al cargar los temas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Error al cargar temas</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
            </div>
        );
    }

    const getAvatarUrl = (user: Topic['user']) => {
        return user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=40`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Foro de Discusión</h1>
                    <p className="mt-2 text-gray-600">Participa en las conversaciones de la comunidad</p>
                </div>
                {user && (
                    <Link
                        to="/topics/new"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Nuevo Tema
                    </Link>
                )}
            </div>

            {/* Topics List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
                {topics && topics.length > 0 ? (
                    topics.map((topic) => (
                        <div key={topic.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <Link to={`/topics/${topic.id}`} className="group">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {topic.title}
                                        </h3>
                                    </Link>
                                    {topic.description && (
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{topic.description}</p>
                                    )}
                                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <img
                                                src={getAvatarUrl(topic.user)}
                                                alt={topic.user.name}
                                                className="h-6 w-6 rounded-full mr-2"
                                            />
                                            <span className="font-medium text-gray-700">{topic.user.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            <span>
                                                {formatDistanceToNow(new Date(topic.created_at), {
                                                    addSuffix: true,
                                                    locale: es,
                                                })}
                                            </span>
                                        </div>
                                        {topic.article && (
                                            <Link
                                                to={`/articles/${topic.article_id}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                📰 Ver artículo relacionado
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-6 flex items-center space-x-2 text-gray-500">
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="text-sm font-medium">{topic.comments_count || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-sm font-semibold text-gray-900">No hay temas</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {user
                                ? 'Sé el primero en iniciar una discusión'
                                : 'Inicia sesión para crear un tema'}
                        </p>
                        {user && (
                            <Link
                                to="/topics/new"
                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Crear Primer Tema
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
