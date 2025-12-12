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

    // Crear un mapa para búsqueda rápida
    const commentMap: { [key: number]: Comment } = {};
    const tree: Comment[] = [];

    // Paso 1: Inicializar el mapa y asegurarse de que cada comentario tenga un array de respuestas
    flatComments.forEach(comment => {
        commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Paso 2: Construir la jerarquía
    flatComments.forEach(comment => {
        const commentWithReplies = commentMap[comment.id];

        if (comment.parent_comment_id) {
            // Esta es una respuesta - agregarla al array de respuestas del padre
            const parent = commentMap[comment.parent_comment_id];
            if (parent) {
                parent.replies = parent.replies || [];
                parent.replies.push(commentWithReplies);
            } else {
                // Padre no encontrado - tratar como raíz (caso especial)
                tree.push(commentWithReplies);
            }
        } else {
            // Este es un comentario raíz
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
