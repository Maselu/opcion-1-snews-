import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TopicList from './pages/TopicList';
import TopicDetail from './pages/TopicDetail';
import NewTopic from './pages/NewTopic';
import WeatherPage from './pages/WeatherPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="articles/:id" element={<ArticleDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="topics" element={<TopicList />} />
          <Route path="topics/new" element={<NewTopic />} />
          <Route path="topics/:id" element={<TopicDetail />} />
          <Route path="weather" element={<WeatherPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
