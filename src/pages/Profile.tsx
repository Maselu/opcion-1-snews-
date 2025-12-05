import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Loader2, User, MessageSquare, Heart, FileText, Save, X } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string;
  created_at: string;
  stats: {
    comments_count: number;
    topics_count: number;
    likes_received_count: number;
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        bio: response.data.bio || '',
        avatar_url: response.data.avatar_url || '',
      });
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await api.put('/profile', formData);

      setSuccess('Perfil actualizado correctamente');
      setEditing(false);
      await fetchProfile();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900">No se pudo cargar el perfil</h3>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  const avatarUrl = formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&size=200`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="flex items-start -mt-16 mb-6">
            <img
              src={avatarUrl}
              alt={formData.name}
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
            />
            <div className="ml-6 flex-1 mt-16">
              {!editing ? (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  {profile.bio && (
                    <p className="mt-3 text-gray-700">{profile.bio}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biografía
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Avatar
                    </label>
                    <input
                      type="url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/avatar.jpg"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-16">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center disabled:opacity-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Comments Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comentarios realizados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {profile.stats.comments_count}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Likes Received Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Likes recibidos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {profile.stats.likes_received_count}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Topics Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temas iniciados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {profile.stats.topics_count}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
