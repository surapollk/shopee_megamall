'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Pagination({ currentPage, totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jumpPage, setJumpPage] = useState('');

  if (totalPages <= 1) return null;

  // Helper to generate URLs for page links
  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Helper to navigate via Go button
  const handleJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      router.push(createPageUrl(pageNum));
      setJumpPage('');
    }
  };

  // Calculate page window (show up to 5 pages)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        หน้า {currentPage.toLocaleString()} จาก {totalPages.toLocaleString()}
      </div>
      
      <div className="pagination-links">
        {/* First Page */}
        <Link 
          href={createPageUrl(1)} 
          className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`}
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : undefined}
          title="หน้าแรก"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
        </Link>
        
        {/* Previous Page */}
        <Link 
          href={createPageUrl(currentPage - 1)} 
          className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`}
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : undefined}
          title="หน้าที่แล้ว"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>

        {/* Page Numbers */}
        {startPage > 1 && <span className="page-ellipsis">...</span>}
        
        {pages.map((p) => (
          <Link 
            key={p} 
            href={createPageUrl(p)} 
            className={`page-btn ${p === currentPage ? 'active' : ''}`}
          >
            {p}
          </Link>
        ))}

        {endPage < totalPages && <span className="page-ellipsis">...</span>}

        {/* Next Page */}
        <Link 
          href={createPageUrl(currentPage + 1)} 
          className={`page-btn ${currentPage >= totalPages ? 'disabled' : ''}`}
          aria-disabled={currentPage >= totalPages}
          tabIndex={currentPage >= totalPages ? -1 : undefined}
          title="หน้าถัดไป"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>

        {/* Last Page */}
        <Link 
          href={createPageUrl(totalPages)} 
          className={`page-btn ${currentPage >= totalPages ? 'disabled' : ''}`}
          aria-disabled={currentPage >= totalPages}
          tabIndex={currentPage >= totalPages ? -1 : undefined}
          title="หน้าสุดท้าย"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
        </Link>
      </div>

      <form className="pagination-jump" onSubmit={handleJump}>
        <span>ไปยังหน้า</span>
        <input 
          type="number" 
          min="1" 
          max={totalPages}
          className="jump-input" 
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder={currentPage.toString()}
        />
        <button type="submit" className="jump-btn">Go</button>
      </form>
    </div>
  );
}
