import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export interface PaginationContextProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  setCurrentPage(newPage: number): void;
  setTotalPages(totalPages: number): void;
  setTotalCount(totalCount: number): void;
}

const PaginationContext = createContext<PaginationContextProps>({
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  setCurrentPage() {},
  setTotalPages() {},
  setTotalCount() {},
});

export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(10);

  const value = useMemo<PaginationContextProps>(
    () => ({
      currentPage,
      totalPages,
      totalCount,
      setCurrentPage,
      setTotalPages,
      setTotalCount,
    }),
    [currentPage, totalPages, totalCount]
  );

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => useContext(PaginationContext);
