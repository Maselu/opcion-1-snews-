import { Link } from 'react-router-dom';
import { Newspaper, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Marca */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Newspaper className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold">SNews</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Tu portal de noticias actualizado con las últimas novedades en general, ciencia, deportes y entretenimiento.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
              <li><Link to="/?category=Ciencia" className="hover:text-blue-400 transition-colors">Ciencia</Link></li>
              <li><Link to="/?category=Deportes" className="hover:text-blue-400 transition-colors">Deportes</Link></li>
              <li><Link to="/?category=Entretenimiento" className="hover:text-blue-400 transition-colors">Entretenimiento</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Términos de uso</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Política de cookies</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>Email: info@snews.com</li>
              <li>Teléfono: +34 123 456 789</li>
              <li>Dirección: Calle Principal 123, Madrid</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 SNews. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
