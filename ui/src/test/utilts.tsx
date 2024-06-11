import * as documentContext from "@/contexts/document";
import * as paginationContext from "@/contexts/pagination";
import { Document } from "@/models/document";

export const useDocumentContextMock = jest.spyOn(
  documentContext,
  "useDocumentContext"
);
export const usePaginationContext = jest.spyOn(
  paginationContext,
  "usePagination"
);

export const prepareDocumentContext = (
  documents: Document[] = [],
  isLoading: boolean = false,
  dispatch: jest.Func = jest.fn(),
  uploadFile: jest.Func = jest.fn()
) => {
  const data = documents.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.id]: cur,
    };
  }, {});

  useDocumentContextMock.mockClear();
  useDocumentContextMock.mockReturnValue({
    state: {
      isLoading,
      documentList: {
        data,
        size: documents.length,
      },
    },
    dispatch,
    uploadFile,
  });
};

export const preparePaginationContext = (
  props: paginationContext.PaginationContextProps
) => {
  usePaginationContext.mockClear();
  usePaginationContext.mockReturnValue(props);
};
