import React from 'react';
import { Star, Heart, Square, Triangle, X } from 'lucide-react';

export const CircleIcon = ({ size = 24, strokeWidth = 2, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const HexagonIcon = ({ size = 24, strokeWidth = 2, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);

export const TransversalIcons = {
  Star: ({ size = 18 }) => <Star size={size} strokeWidth={2.5} />,
  Hexagon: ({ size = 18 }) => <HexagonIcon size={size} strokeWidth={2.5} />,
  Circle: ({ size = 18 }) => <CircleIcon size={size} strokeWidth={2.5} />,
  Heart: ({ size = 18 }) => <Heart size={size} strokeWidth={2.5} />,
  Square: ({ size = 18 }) => <Square size={size} strokeWidth={2.5} />,
  Triangle: ({ size = 18 }) => <Triangle size={size} strokeWidth={2.5} />,
  Cross: ({ size = 18 }) => <X size={size} strokeWidth={3} />
};
