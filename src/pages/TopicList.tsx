import { useFetch } from '../hooks/useFetch';
import { Topic } from '../types';
import { Loader2, MessageSquare, User, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TopicList() {
    const { user } = useAuth();
    const { data: topics, loading, error } = useFetch<Topic[]>('/topics');

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
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading topics</h3>
                <p className="mt-1 text-sm text-gray-500">{error.message}</p>
            </div>
        );
    }

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
                                            <User className="h-4 w-4 mr-1" />
                                            <span>Usuario</span>
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
                                        {topic.article_id && (
                                            <Link
                                                to={`/articles/${topic.article_id}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Ver artículo relacionado
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-6 flex items-center space-x-2 text-gray-500">
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="text-sm font-medium">0</span>
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
                    </div>
                )}
            </div>
        </div>
    );
}
