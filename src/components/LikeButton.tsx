import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  commentId: number;
  initialLiked?: boolean;
  initialCount?: number;
  onLike?: (commentId: number, isLiked: boolean) => void;
}

export function LikeButton({
  commentId,
  initialLiked = false,
  initialCount = 0,
  onLike,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    setIsAnimating(true);

    onLike?.(commentId, newLikedState);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleLike}
      className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-secondary-100 transition-colors group"
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${
          isAnimating ? 'animate-heart-pump' : ''
        } ${
          isLiked
            ? 'fill-red-500 text-red-500'
            : 'text-secondary-400 group-hover:text-red-500'
        }`}
      />
      <span
        className={`text-sm font-medium transition-colors ${
          isLiked ? 'text-red-500' : 'text-secondary-600 group-hover:text-secondary-900'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
