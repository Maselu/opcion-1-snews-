import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { MessageSquare, ThumbsUp, FileText, Settings, Calendar } from 'lucide-react';

export function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This will be replaced with actual API calls when backend is ready
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Mock data for development
        const mockUser = {
          id: 1,
          name: 'Ana Martínez',
          email: 'ana.martinez@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=random',
          bio: 'Periodista y amante de la tecnología. Me encanta estar al día de las últimas noticias.',
          joined_at: '2023-01-15T10:30:00Z',
          stats: {
            comments: 42,
            likes: 128,
            topics: 7
          },
          activity: {
            comments: [
              {
                id: 1,
                content: 'Me parece un análisis muy acertado sobre la situación actual.',
                article_id: 5,
                article_title: 'La inflación sigue en aumento en la eurozona',
                created_at: '2023-11-01T14:30:00Z'
              },
              {
                id: 2,
                content: 'Interesante perspectiva, aunque creo que hay otros factores a considerar.',
                article_id: 8,
                article_title: 'Nuevas tecnologías que revolucionarán el 2024',
                created_at: '2023-10-28T09:15:00Z'
              },
              {
                id: 3,
                content: '¡Increíble noticia! Esto cambiará el panorama tecnológico.',
                article_id: 12,
                article_title: 'Apple presenta su nuevo dispositivo de realidad aumentada',
                created_at: '2023-10-25T16:45:00Z'
              }
            ],
            topics: [
              {
                id: 1,
                title: '¿Cómo afectará la IA al mercado laboral en los próximos años?',
                created_at: '2023-10-20T11:30:00Z',
                comments_count: 15
              },
              {
                id: 2,
                title: 'Debate: ¿Son efectivas las medidas contra el cambio climático?',
                created_at: '2023-09-15T08:45:00Z',
                comments_count: 28
              }
            ]
          }
        };
        
        setUser(mockUser);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-8">
              <div className="rounded-full bg-gray-200 h-24 w-24"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-md">
            <h2 className="text-red-800 text-xl font-bold">Error</h2>
            <p className="text-red-600">{error || 'User not found'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img 
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Settings size={16} />
              </button>
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.bio}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Se unió el {new Date(user.joined_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-1" />
                  <span>{user.stats.comments} comentarios</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp size={16} className="mr-1" />
                  <span>{user.stats.likes} likes</span>
                </div>
                <div className="flex items-center">
                  <FileText size={16} className="mr-1" />
                  <span>{user.stats.topics} temas</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Editar perfil
              </button>
            </div>
          </div>
        </div>
        
        {/* Activity Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Actividad reciente</h2>
          
          <Tabs defaultValue="comments" className="w-full">
            <TabsList>
              <TabsTrigger value="comments">
                <MessageSquare size={16} className="mr-2" />
                Comentarios
              </TabsTrigger>
              <TabsTrigger value="topics">
                <FileText size={16} className="mr-2" />
                Temas
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="comments">
                <div className="space-y-6">
                  {user.activity.comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4 last:border-0 animate-fadeIn">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">
                          <a href={`/article/${comment.article_id}`} className="hover:text-blue-600 transition-colors">
                            {comment.article_title}
                          </a>
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="topics">
                <div className="space-y-6">
                  {user.activity.topics.map((topic) => (
                    <div key={topic.id} className="border-b pb-4 last:border-0 animate-fadeIn">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">
                          <a href={`/topic/${topic.id}`} className="hover:text-blue-600 transition-colors">
                            {topic.title}
                          </a>
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(topic.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare size={14} className="mr-1" />
                        <span>{topic.comments_count} comentarios</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Profile;