import { useState } from 'react';
import { Search, Menu, X, Bell, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const categories = ['News', 'Sports', 'Weather', 'Entertainment'];

export function Header({ activeCategory = 'News', onCategoryChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-secondary-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-secondary-900">Forum</span>
            </div>

            <nav className="hidden md:flex space-x-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange?.(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <>
                <button
                  className="hidden md:flex items-center space-x-2 btn-primary"
                  aria-label="Create topic"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Topic</span>
                </button>

                <button
                  className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 animate-scale-in">
                      <button className="w-full px-4 py-2 text-left text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button className="btn-secondary">Sign In</button>
                <button className="btn-primary">Sign Up</button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-secondary-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="py-4 border-t border-secondary-200 animate-slide-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search articles, topics, users..."
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200 animate-slide-in">
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange?.(category);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left rounded-lg font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
            {!user && (
              <div className="mt-4 space-y-2">
                <button className="w-full btn-secondary">Sign In</button>
                <button className="w-full btn-primary">Sign Up</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
