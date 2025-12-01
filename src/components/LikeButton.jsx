import React, { useState } from 'react';
import './LikeButton.css';

export function LikeButton({ initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);

  const handleLike = () => {
    if (!animating) {
      setAnimating(true);
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setAnimating(false);
      }, 1000);
    }
  };

  return (
    <button 
      onClick={handleLike}
      className={`like-button flex items-center ${liked ? 'liked' : ''} ${animating ? 'animate' : ''}`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 mr-1 heart-icon" 
        fill={liked ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span>{likes}</span>
    </button>
  );
}

export default LikeButton;