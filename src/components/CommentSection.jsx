import React, { useState, useEffect } from 'react';
import { Send, Edit, Trash2 } from 'lucide-react';

export function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Será reemplazado por la verificación de autenticación real.

  useEffect(() => {
    // Será reemplazado con llamadas reales a la API cuando el backend esté listo
    const fetchComments = async () => {
      try {
        setLoading(true);
        // Datos de desarrollo
        const mockComments = [
          {
            id: 1,
            content: 'Excelente artículo, muy informativo.',
            created_at: '2023-11-02T14:30:00Z',
            updated_at: '2023-11-02T14:30:00Z',
            user: {
              id: 1,
              name: 'María García',
              avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=random'
            },
            likes: 5,
            is_edited: false
          },
          {
            id: 2,
            content: 'No estoy de acuerdo con algunos puntos mencionados. Creo que la situación es más compleja.',
            created_at: '2023-11-02T15:45:00Z',
            updated_at: '2023-11-02T16:20:00Z',
            user: {
              id: 2,
              name: 'Carlos Rodríguez',
              avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=random'
            },
            likes: 2,
            is_edited: true
          },
          {
            id: 3,
            content: 'Me gustaría ver más información sobre las consecuencias a largo plazo.',
            created_at: '2023-11-03T09:15:00Z',
            updated_at: '2023-11-03T09:15:00Z',
            user: {
              id: 3,
              name: 'Ana Martínez',
              avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=random'
            },
            likes: 8,
            is_edited: false
          }
        ];
        
        setComments(mockComments);
        // Simular usuario autenticado para desarrollo
        setIsLoggedIn(true);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Será reemplazado con llamadas reales a la API cuando el backend esté listo
    const newCommentObj = {
      id: Date.now(),
      content: newComment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 4, // ID del usuario actual
        name: 'Current User',
        avatar: 'https://ui-avatars.com/api/?name=Current+User&background=random'
      },
      likes: 0,
      is_edited: false
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Comentarios ({comments.length})</h2>
      
      {/* Comment Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start">
            <img 
              src="https://ui-avatars.com/api/?name=Current+User&background=random"
              alt="Your avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="3"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  disabled={!newComment.trim()}
                >
                  <Send size={16} className="mr-2" />
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8 text-center">
          <p>Inicia sesión para comentar</p>
          <a href="/login" className="text-blue-600 hover:underline">Iniciar sesión</a>
        </div>
      )}
      
      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex">
              <div className="rounded-full bg-gray-200 h-10 w-10 mr-3"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex animate-fadeIn">
              <img 
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-grow">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{comment.user.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()} 
                        {comment.is_edited && <span className="ml-2 italic">(editado)</span>}
                      </p>
                    </div>
                    
                    {/* Comment Actions */}
                    <div className="flex space-x-2">
                      {isLoggedIn && comment.user.id === 4 && ( // Verificación del ID del usuario actual
                        <>
                          <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="mt-2">{comment.content}</p>
                  
                  <div className="mt-3 flex items-center">
                    <button 
                      className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;