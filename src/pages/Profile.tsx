import { useState } from 'react';
import { MessageSquare, Heart, TrendingUp, Calendar } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

interface ActivityItem {
  id: number;
  type: 'comment' | 'like' | 'topic';
  title: string;
  content?: string;
  timestamp: string;
}

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'comments' | 'topics' | 'likes'>('comments');

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-secondary-600 mb-4">Please sign in to view your profile.</p>
          <button className="btn-primary">Sign In</button>
        </div>
        <Footer />
      </div>
    );
  }

  const mockActivity: ActivityItem[] = [
    {
      id: 1,
      type: 'comment',
      title: 'Breaking: Major technological breakthrough announced',
      content: 'This is incredible news! Solar energy has needed a breakthrough like this.',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'topic',
      title: 'Best practices for React development',
      content: 'What are your favorite patterns and techniques when building React applications?',
      timestamp: '5 hours ago',
    },
    {
      id: 3,
      type: 'like',
      title: 'Championship finals set for this weekend',
      timestamp: '1 day ago',
    },
  ];

  const stats = [
    { label: 'Comments', value: 142, icon: MessageSquare, color: 'text-primary-600' },
    { label: 'Likes Given', value: 89, icon: Heart, color: 'text-red-500' },
    { label: 'Topics Created', value: 12, icon: TrendingUp, color: 'text-accent-600' },
    { label: 'Likes Received', value: 234, icon: Heart, color: 'text-red-500' },
  ];

  const joinDate = new Date(user.created_at);
  const formattedDate = joinDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <div className="flex-shrink-0 mb-6 md:mb-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white font-bold text-5xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 mb-2">{user.name}</h1>
                  <p className="text-secondary-600 mb-2">{user.email}</p>
                  <div className="flex items-center space-x-2 text-sm text-secondary-500">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formattedDate}</span>
                  </div>
                </div>
                <button className="btn-secondary mt-4 md:mt-0">Edit Profile</button>
              </div>

              <p className="text-secondary-700 mb-6">
                {user.bio || 'No bio yet. Add a bio to tell others about yourself!'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-secondary-50 rounded-lg p-4 text-center animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-secondary-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-secondary-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex border-b border-secondary-200 mb-6">
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'comments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'topics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Topics
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'likes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Liked
            </button>
          </div>

          <div className="space-y-4">
            {mockActivity
              .filter((item) => {
                if (activeTab === 'comments') return item.type === 'comment';
                if (activeTab === 'topics') return item.type === 'topic';
                if (activeTab === 'likes') return item.type === 'like';
                return false;
              })
              .map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.type === 'comment' && (
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                      )}
                      {item.type === 'topic' && (
                        <TrendingUp className="w-5 h-5 text-accent-600" />
                      )}
                      {item.type === 'like' && <Heart className="w-5 h-5 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary-900 mb-1">{item.title}</h3>
                      {item.content && (
                        <p className="text-sm text-secondary-600 mb-2">{item.content}</p>
                      )}
                      <span className="text-xs text-secondary-500">{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {mockActivity.filter((item) => {
            if (activeTab === 'comments') return item.type === 'comment';
            if (activeTab === 'topics') return item.type === 'topic';
            if (activeTab === 'likes') return item.type === 'like';
            return false;
          }).length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary-600">No activity yet in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
