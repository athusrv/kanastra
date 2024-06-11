import { preparePaginationContext } from "@/test/utilts";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentsPagination } from "./document-pagination";

test("should render the pagination", async () => {
  preparePaginationContext({
    currentPage: 1,
    totalCount: 1,
    totalPages: 1,
    setCurrentPage: () => {},
    setTotalCount: () => {},
    setTotalPages: () => {},
  });

  const component = render(<DocumentsPagination />);
  const el = await component.findByTestId("pagination");

  expect(el).toBeDefined();
});

test("should render the corrent number of pages", async () => {
  preparePaginationContext({
    currentPage: 1,
    totalCount: 40,
    totalPages: 2,
    setCurrentPage: () => {},
    setTotalCount: () => {},
    setTotalPages: () => {},
  });

  const component = render(<DocumentsPagination />);
  expect(await component.findAllByTestId("page-number")).toHaveLength(2);
});
test("clicking previous should call setCurrentPage", async () => {
  const fn = jest.fn();
  preparePaginationContext({
    currentPage: 2,
    totalCount: 40,
    totalPages: 2,
    setCurrentPage: fn,
    setTotalCount: () => {},
    setTotalPages: () => {},
  });

  const component = render(<DocumentsPagination />);
  const btn = await component.findByTestId("previous-page-btn");
  await userEvent.click(btn);

  expect(fn).toHaveBeenCalledWith(1);
});

test("clicking previous should not call setCurrentPage", async () => {
  const fn = jest.fn();
  preparePaginationContext({
    currentPage: 1,
    totalCount: 40,
    totalPages: 2,
    setCurrentPage: fn,
    setTotalCount: () => {},
    setTotalPages: () => {},
  });

  const component = render(<DocumentsPagination />);
  const btn = await component.findByTestId("previous-page-btn");
  await userEvent.click(btn);

  expect(fn).not.toHaveBeenCalled();
});

test("clicking next should call setCurrentPage", async () => {
  const fn = jest.fn();
  preparePaginationContext({
    currentPage: 1,
    totalCount: 40,
    totalPages: 2,
    setCurrentPage: fn,
    setTotalCount: () => {},
    setTotalPages: () => {},
  });

  const component = render(<DocumentsPagination />);
  const btn = await component.findByTestId("next-page-btn");
  await userEvent.click(btn);

  expect(fn).toHaveBeenCalledWith(2);
});

test("clicking next should not call setCurrentPage", async () => {
  const fn = jest.fn();
  preparePaginationContext({
    currentPage: 2,
    totalCount: 40,
    totalPages: 2,
    setCurrentPage: fn,
    setTotalCount: () => {},
    setTotalPages: () => {},
  });

  const component = render(<DocumentsPagination />);
  const btn = await component.findByTestId("next-page-btn");
  await userEvent.click(btn);

  expect(fn).not.toHaveBeenCalled();
});
