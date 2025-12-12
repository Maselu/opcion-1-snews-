import { Comment } from '../types';
import CommentItem from './CommentItem';

interface CommentListProps {
    comments: Comment[];
    onReply: (parentId: number, authorName: string) => void;
    onDelete: (commentId: number) => void;
    onEdit: (commentId: number, newContent: string) => void;
}

export default function CommentList({ comments, onReply, onDelete, onEdit }: CommentListProps) {
    return (
        <div className="divide-y divide-gray-200">
            {comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={onReply}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
