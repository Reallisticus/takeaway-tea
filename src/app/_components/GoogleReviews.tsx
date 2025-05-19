"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../../trpc/react";

interface GoogleReviewsProps {
  placeId: string;
  className?: string;
}

export function GoogleReviews({ placeId, className = "" }: GoogleReviewsProps) {
  // Use tRPC to fetch Google reviews
  const { data, isLoading, error } = api.g.getReviews.useQuery(
    { placeId },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  // Generate the Google Maps review URL from the place ID
  const reviewUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;

  // Generate stars for visual representation
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <StarFull key={i} />;
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} />;
          } else {
            return <StarEmpty key={i} />;
          }
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  if (error || !data) {
    return null; // Don't show anything if there's an error
  }

  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center space-x-2 transition-colors duration-200 hover:text-white"
      >
        {renderStars(data.rating)}
        <span className="text-sm font-medium">
          {data.rating} ({data.reviewCount} отзива)
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
        >
          <path
            fillRule="evenodd"
            d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </motion.div>
  );
}

// Star components
function StarFull() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-yellow-400"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StarHalf() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-yellow-400"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M12 5.25V18.354l4.627 2.826c.996.608 2.231-.29 1.96-1.425l-1.257-5.273 4.117-3.527c.887-.76.415-2.212-.749-2.305l-5.404-.434-2.082-5.006c-.448-1.077-1.976-1.077-2.424 0l-2.082 5.006-5.404.434c-1.164.093-1.636 1.545-.749 2.305l4.117 3.527-1.257 5.273c-.271 1.136.964 2.033 1.96 1.425L12 18.354V5.25Z"
        fill="white"
      />
    </svg>
  );
}

function StarEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-4 w-4 text-yellow-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}
