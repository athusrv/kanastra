import { act, renderHook } from "@testing-library/react";
import { PaginationProvider, usePagination } from "./pagination";

const render = () =>
  renderHook(usePagination, {
    wrapper: ({ children }) => (
      <PaginationProvider>{children}</PaginationProvider>
    ),
  });

it("renders initial hook", () => {
  const { result } = render();
  expect(result.current.currentPage).toBe(1);
  expect(result.current.totalPages).toBe(1);
});

it("changes current page", () => {
  const { result } = render();

  act(() => {
    result.current.setCurrentPage(2);
  });

  expect(result.current.currentPage).toBe(2);
});

it("changes total pages", () => {
  const { result } = render();

  act(() => {
    result.current.setTotalPages(2);
  });

  expect(result.current.totalPages).toBe(2);
});
it("changes total count", () => {
  const { result } = render();

  act(() => {
    result.current.setTotalCount(2);
  });

  expect(result.current.totalCount).toBe(2);
});
