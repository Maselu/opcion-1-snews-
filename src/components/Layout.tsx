import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, LogOut, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import WeatherWidget from './WeatherWidget';
import Footer from './Footer';

export default function Layout() {
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Desktop Nav */}
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-2xl font-bold tracking-tight">SNews</Link>
                            <nav className="hidden md:flex space-x-6 text-sm font-medium">
                                {/*<Link to="/?category=Noticias" className="hover:text-blue-200 transition-colors">Noticias</Link>*/}
                                <Link to="/?category=Deportes" className="hover:text-blue-200 transition-colors">Deportes</Link>
                                <Link to="/?category=Ciencia" className="hover:text-blue-200 transition-colors">Ciencia</Link>
                                <Link to="/topics" className="hover:text-blue-200 transition-colors">Foro</Link>
                            </nav>
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="pl-10 pr-4 py-1.5 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
                                />
                            </div>

                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <Link to="/profile" className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors">
                                        <img
                                            src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                                            className="h-6 w-6 rounded-full"
                                            alt=""
                                        />
                                        <span className="text-sm font-medium max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                                    </Link>
                                    <button onClick={signOut} title="Salir" className="hover:text-blue-200">
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center space-x-1 bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors">
                                    <LogIn className="h-4 w-4" />
                                    <span>Entrar</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-blue-700 px-4 pt-2 pb-4 space-y-2">
                        <Link to="/" className="block py-2 hover:bg-blue-600 rounded">Noticias</Link>
                        <Link to="/?category=Deportes" className="block py-2 hover:bg-blue-600 rounded">Deportes</Link>
                        <Link to="/topics" className="block py-2 hover:bg-blue-600 rounded">Foro</Link>
                        <div className="pt-2 border-t border-blue-500">
                            {user ? (
                                <>
                                    <Link to="/profile" className="block py-2">Mi Perfil</Link>
                                    <button onClick={signOut} className="block w-full text-left py-2">Cerrar Sesión</button>
                                </>
                            ) : (
                                <Link to="/login" className="block py-2 font-bold">Iniciar Sesión</Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>

                {/* Sidebar */}
                <aside className="w-full md:w-80 space-y-6">
                    <WeatherWidget />

                    {/* Ad Placeholder or Trending Topics */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Tendencias</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                                <span className="w-6 text-gray-400">#1</span> Tecnología
                            </li>
                            <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                                <span className="w-6 text-gray-400">#2</span> Champions League
                            </li>
                            <li className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                                <span className="w-6 text-gray-400">#3</span> React 19
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
