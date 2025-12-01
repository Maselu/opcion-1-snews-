import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, TrendingUp, MessageSquare } from 'lucide-react';

export function Sidebar() {
  // Mock popular topics
  const popularTopics = [
    { id: 1, title: 'Elecciones 2024', count: 45 },
    { id: 2, title: 'Cambio climático', count: 32 },
    { id: 3, title: 'Inteligencia artificial', count: 28 },
    { id: 4, title: 'Crisis energética', count: 24 },
    { id: 5, title: 'Economía global', count: 19 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp size={18} className="mr-2 text-blue-600" />
          Temas populares
        </h3>
        <ul className="space-y-3">
          {popularTopics.map(topic => (
            <li key={topic.id}>
              <Link 
                to={`/topic/${topic.id}`}
                className="flex justify-between items-center hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <span className="font-medium">{topic.title}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {topic.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <MessageSquare size={18} className="mr-2 text-blue-600" />
          Únete a la conversación
        </h3>
        <p className="text-gray-600 mb-4">
          Participa en debates, comparte tus opiniones y conecta con otros lectores.
        </p>
        <Link 
          to="/login"
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Iniciar sesión
        </Link>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500">¿No tienes cuenta? </span>
          <Link to="/register" className="text-sm text-blue-600 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Newspaper size={18} className="mr-2 text-blue-600" />
          Suscríbete al boletín
        </h3>
        <p className="text-gray-600 mb-4">
          Recibe las noticias más importantes en tu correo electrónico.
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Suscribirse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Sidebar;