// components/Pagination.tsx
'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
}

const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7,
): (number | '...')[] => {
  const pages: (number | '...')[] = [];

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const left = Math.max(2, currentPage - 2);
    const right = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);
  }

  return pages;
};

export default function PaginationComponent({ currentPage, totalPages, onPageChangeAction }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem hidden={currentPage === 1} onClick={() => onPageChangeAction(currentPage - 1)}>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {/* các trang */}
        {pages.map((page, index) =>
          page === '...' ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index} onClick={() => onPageChangeAction(page)}>
              <PaginationLink href="#">{page}</PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem hidden={currentPage === totalPages} onClick={() => onPageChangeAction(currentPage + 1)}>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}