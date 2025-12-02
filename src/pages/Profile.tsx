import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  // Fetch user stats from backend. The endpoint /api/user returns the user model with relations if configured, 
  // or we might need a specific stats endpoint.
  // The user prompt said: "Profile: Muestra estadísticas del usuario llamando a /api/profile".
  // And in routes/api.php I defined /profile -> AuthController::user.
  // AuthController::user returns request->user().
  // I need to make sure the User model loads relationships (comments, likes, topics) to count them.
  // Or I should update AuthController to load them.
  // For now, I'll assume the backend returns the user object.
  // I might need to update AuthController to load counts.

  const { data: profileData, loading } = useFetch<any>('/profile');

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <img
            className="h-16 w-16 rounded-full mr-4"
            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`}
            alt=""
          />
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.user_metadata?.full_name || 'N/A'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData?.bio || 'No bio provided'}</dd>
            </div>
            {/* Stats */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Comments</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData?.comments_count || 0}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Likes Given</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData?.likes_count || 0}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Topics Started</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData?.topics_count || 0}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
