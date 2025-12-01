import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { ArticleDetail } from './pages/ArticleDetail';

type Page = 'home' | 'login' | 'register' | 'profile' | 'article';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && (currentPage === 'login' || currentPage === 'register')) {
    if (currentPage === 'login') {
      return <Login onSwitch={() => setCurrentPage('register')} />;
    }
    return <Register onSwitch={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'profile') {
    return <Profile />;
  }

  if (currentPage === 'article' && selectedArticleId) {
    return <ArticleDetail articleId={selectedArticleId} />;
  }

  return <Home />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
