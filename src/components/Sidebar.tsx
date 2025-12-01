import { TrendingUp, MessageSquare, Cloud } from 'lucide-react';

interface Topic {
  id: number;
  title: string;
  replies: number;
}

interface SidebarProps {
  trendingTopics?: Topic[];
}

export function Sidebar({ trendingTopics = [] }: SidebarProps) {
  const defaultTopics: Topic[] = [
    { id: 1, title: 'Best practices for React development', replies: 42 },
    { id: 2, title: 'Understanding TypeScript generics', replies: 28 },
    { id: 3, title: 'Tailwind CSS tips and tricks', replies: 35 },
    { id: 4, title: 'Database optimization techniques', replies: 19 },
    { id: 5, title: 'API design principles', replies: 24 },
  ];

  const topics = trendingTopics.length > 0 ? trendingTopics : defaultTopics;

  return (
    <aside className="space-y-6">
      <div className="card p-5">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent-600" />
          <h2 className="font-semibold text-secondary-900">Trending Topics</h2>
        </div>
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <h3 className="text-sm font-medium text-secondary-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                {topic.title}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
                <MessageSquare className="w-3 h-3 text-secondary-400" />
                <span className="text-xs text-secondary-500">{topic.replies} replies</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Cloud className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-secondary-900">Weather Update</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Madrid</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-secondary-900">22°</span>
              <Cloud className="w-6 h-6 text-secondary-400" />
            </div>
          </div>
          <div className="text-xs text-secondary-500">
            Partly cloudy with a chance of rain
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View full forecast →
          </button>
        </div>
      </div>

      <div className="card p-5 bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
        <h2 className="font-semibold text-secondary-900 mb-2">Start a Discussion</h2>
        <p className="text-sm text-secondary-600 mb-4">
          Share your thoughts and connect with the community
        </p>
        <button className="w-full btn-primary">Create Topic</button>
      </div>
    </aside>
  );
}
