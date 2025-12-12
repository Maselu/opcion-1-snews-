import { Comment } from '../types';

/**
 * Builds a hierarchical tree structure from a flat list of comments
 * Enables infinite nesting depth (YouTube/Reddit style)
 * 
 * @param flatComments - Flat array of all comments
 * @returns Array of root-level comments with nested replies
 */
export const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    if (!flatComments || flatComments.length === 0) {
        return [];
    }

    // Create a map for quick lookup
    const commentMap: { [key: number]: Comment } = {};
    const tree: Comment[] = [];

    // Step 1: Initialize map and ensure each comment has a replies array
    flatComments.forEach(comment => {
        commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Step 2: Build the hierarchy
    flatComments.forEach(comment => {
        const commentWithReplies = commentMap[comment.id];

        if (comment.parent_comment_id) {
            // This is a reply - add it to parent's replies array
            const parent = commentMap[comment.parent_comment_id];
            if (parent) {
                parent.replies = parent.replies || [];
                parent.replies.push(commentWithReplies);
            } else {
                // Parent not found - treat as root (edge case)
                tree.push(commentWithReplies);
            }
        } else {
            // This is a root comment
            tree.push(commentWithReplies);
        }
    });

    return tree;
};

/**
 * Counts total number of comments including all nested replies
 * 
 * @param comments - Array of comments (can be tree or flat)
 * @returns Total count
 */
export const countAllComments = (comments: Comment[]): number => {
    let count = 0;

    const countRecursive = (commentList: Comment[]) => {
        commentList.forEach(comment => {
            count++;
            if (comment.replies && comment.replies.length > 0) {
                countRecursive(comment.replies);
            }
        });
    };

    countRecursive(comments);
    return count;
};
