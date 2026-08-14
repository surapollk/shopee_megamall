'use client';
import { useState, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function SwipeToNavigate({ children, currentPage, totalPages }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Minimum swipe distance (in px) to trigger page change
  const minSwipeDistance = 100;

  const navigateToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', pageNumber.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;
    const currentX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    setTouchEnd(currentX);
    
    // Optional: visual feedback
    const diff = currentX - touchStart;
    // Limit visual drag to 150px
    if (Math.abs(diff) < 150) {
      setTranslateX(diff);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      resetState();
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages) {
      navigateToPage(currentPage + 1);
    } else if (isRightSwipe && currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
    
    resetState();
  };

  const resetState = () => {
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
    setTranslateX(0);
  };

  // Prevent default drag behaviors for images/links inside
  const onDragStart = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      style={{ 
        transform: `translateX(${translateX}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        cursor: isSwiping ? 'grabbing' : 'auto'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={(e) => {
        if (touchStart) onTouchMove(e);
      }}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onDragStart={onDragStart}
    >
      {children}
    </div>
  );
}
