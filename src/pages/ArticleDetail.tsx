import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { Article, Comment } from '../types';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import CommentList from '../components/CommentList';
import { Loader2, Send, Calendar, Tag, ExternalLink, MessageSquarePlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { buildCommentTree } from '../utils/commentUtils';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: article, loading, error } = useFetch<Article>(`/articles/${id}`);
  const { user } = useAuth();

  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyToName, setReplyToName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  // Update comments when article loads
  useState(() => {
    if (article) {
      setComments((article as any).comments as Comment[] || []);
    }
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      await api.post(`/articles/${id}/comments`, {
        content: commentContent,
        parent_comment_id: replyTo
      });
      setCommentContent('');
      setReplyTo(null);
      setReplyToName('');
      // Refresh article data to get updated comments
      window.location.reload();
    } catch (error) {
      console.error('Error posting comment', error);
      alert('Error al publicar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment', error);
      alert('Error al eliminar el comentario');
    }
  };

  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      await api.put(`/comments/${commentId}`, { content: newContent });
      window.location.reload();
    } catch (error) {
      console.error('Error editing comment', error);
      alert('Error al editar el comentario');
    }
  };

  const handleReply = (parentId: number, authorName: string) => {
    setReplyTo(parentId);
    setReplyToName(authorName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900">Artículo no encontrado</h3>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Build hierarchical comment tree from flat list
  const allComments = (article as any)?.comments as Comment[] || [];
  const commentTree = buildCommentTree(allComments);

  return (
    <div className="space-y-8">
      {/* Article Header */}
      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Hero Image Placeholder */}
        <div className="h-64 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-8xl opacity-20">📰</span>
          </div>
        </div>

        <div className="p-8">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
              <Tag className="h-3.5 w-3.5 mr-1" />
              {article.category?.name || 'News'}
            </span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: es })}
            </div>
            {article.source && (
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="font-medium">{article.source}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>

          {/* Actions */}
          {user && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                to={`/topics/new?article=${id}`}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <MessageSquarePlus className="h-5 w-5 mr-2" />
                Iniciar Tema de Discusión
              </Link>
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comentarios ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-4">
              <img
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                alt=""
                className="h-10 w-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                {replyTo && (
                  <div className="text-sm text-gray-600 mb-2 flex justify-between items-center bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <span className="font-medium">Respondiendo a @{replyToName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyToName('');
                      }}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 resize-none"
                  rows={3}
                  disabled={submitting}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentContent.trim() || submitting}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-700">
              <Link
                to="/login"
                state={{ from: location }}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Inicia sesión
              </Link>{' '}
              para dejar un comentario
            </p>
          </div>
        )}

        {commentTree.length > 0 ? (
          <CommentList
            comments={commentTree}
            onReply={handleReply}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
