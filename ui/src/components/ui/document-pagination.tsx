import { usePagination } from "@/contexts/pagination";
import { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

export const DocumentsPagination = () => {
  const { currentPage, totalPages, setCurrentPage } = usePagination();

  const onPrevious = useCallback(() => {
    if (currentPage == 1) return;

    setCurrentPage(currentPage - 1);
  }, [setCurrentPage, currentPage]);

  const onNext = useCallback(() => {
    if (currentPage == totalPages) return;

    setCurrentPage(currentPage + 1);
  }, [setCurrentPage, currentPage, totalPages]);

  return (
    <Pagination className="mt-4" data-testid="pagination">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            data-testid="previous-page-btn"
            disabled={currentPage == 1}
            onClick={onPrevious}
          />
        </PaginationItem>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: 2 }).map((_, index) => {
          const page = currentPage + index;
          return page > 0 && page <= totalPages ? (
            <PaginationItem key={index} data-testid="page-number">
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : null;
        })}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            data-testid="next-page-btn"
            disabled={currentPage == totalPages}
            onClick={onNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
