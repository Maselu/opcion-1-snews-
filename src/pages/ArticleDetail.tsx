import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { Article, Comment } from '../types';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import CommentList from '../components/CommentList';
import { Loader2, Send } from 'lucide-react';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: article, loading, error } = useFetch<Article>(`/articles/${id}`);
  const { user } = useAuth();

  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await api.post(`/articles/${id}/comments`, {
        content: commentContent,
        parent_comment_id: replyTo
      });
      setCommentContent('');
      setReplyTo(null);
      // Ideally refetch comments or optimistically update
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error('Error posting comment', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  if (error || !article) return <div className="text-center p-12">Article not found</div>;

  // Type assertion or check for comments since they might be nested in article or fetched separately
  // The backend ArticleController show method includes 'comments'
  const comments = (article as any).comments as Comment[] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-8">
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{article.category?.name}</span>
          <span className="mx-2">•</span>
          <span>{article.source}</span>
        </div>
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {article.content}
        </div>
      </article>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>

        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-4">
              <img
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`}
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                {replyTo && (
                  <div className="text-sm text-gray-500 mb-2 flex justify-between">
                    <span>Replying to comment #{replyTo}</span>
                    <button type="button" onClick={() => setReplyTo(null)} className="text-red-500">Cancel</button>
                  </div>
                )}
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 p-3"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md text-center mb-8">
            <p>Please <a href="/login" className="text-primary-600 hover:underline">sign in</a> to leave a comment.</p>
          </div>
        )}

        <CommentList
          comments={comments}
          onReply={setReplyTo}
          onDelete={handleDeleteComment}
        />
      </div>
    </div>
  );
}
