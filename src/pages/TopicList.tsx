import { useFetch } from '../hooks/useFetch';
import { Topic } from '../types';
import { Link } from 'react-router-dom';
import { Loader2, MessageSquare } from 'lucide-react';

export default function TopicList() {
    const { data: topics, loading, error } = useFetch<{ data: Topic[] }>('/topics');

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-center p-12">Error loading topics</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Forum Topics</h1>
                {/* Add Create Topic button here if auth */}
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {topics?.data?.map((topic) => (
                        <li key={topic.id}>
                            <Link to={`/topics/${topic.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary-600 truncate">{topic.title}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {new Date(topic.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                {topic.user?.name || 'Unknown User'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
