import { useAPI } from "@/contexts/api";
import { DocumentStatus } from "@/models/document";
import {
  DocumentAction,
  DocumentActionType,
  DocumentContextState,
  DocumentContextType,
  DocumentProviderProps,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { usePagination } from "./pagination";

export const DocumentContextInitialValues: Partial<DocumentContextState> = {
  isLoading: false,
  documentList: {
    data: {},
    size: 0,
  },
};

const DocumentContext = createContext({} as DocumentContextType);

const DocumentReducer = (
  state: DocumentContextState,
  action: DocumentAction
): DocumentContextState => {
  let size = state.documentList.size || 0;
  switch (action.type) {
    case DocumentActionType.POPULATE_DOCUMENTS:
      if (!action.payload?.documentList?.data) {
        throw new Error(
          "documentList data must be a valid record of Documents"
        );
      }

      return {
        ...state,
        documentList: {
          ...action.payload.documentList,
          size: Object.keys(action.payload.documentList.data).length,
        },
      };
    case DocumentActionType.SET_STATUS_COMPLETE:
    case DocumentActionType.SET_STATUS_FAILURE:
      if (!action.payload?.document) {
        throw new Error("document must be a valid Document");
      }

      let document = state.documentList.data?.[action.payload.document.id];
      if (!document) {
        document = action.payload.document;
        size += 1;
      }

      let status = DocumentStatus.COMPLETE;
      if (action.type === DocumentActionType.SET_STATUS_FAILURE) {
        status = DocumentStatus.FAILED;
      }

      return {
        ...state,
        documentList: {
          data: {
            ...state.documentList.data,
            [document.id]: {
              ...document,
              status,
            },
          },
          size,
        },
      };
    case DocumentActionType.LOADING_CHANGE:
      return {
        ...state,
        isLoading: !!action.payload?.isLoading,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const api = useAPI();
  const pagination = usePagination();

  const [state, dispatch] = useReducer(
    DocumentReducer,
    DocumentContextInitialValues as DocumentContextState
  );

  const { data, refetch } = useQuery({
    queryKey: ["getDocuments", pagination.currentPage],
    queryFn: () => api.getDocuments((pagination.currentPage - 1) * 20),
  });

  const { mutateAsync: upload } = useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: (data: FormData) => api.upload(data),
  });

  useEffect(() => {
    if (!data) return;

    const count = data.data.total;

    pagination.setTotalCount(count);
    pagination.setTotalPages(Math.ceil(count / 20));

    const list = data.data.documents.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.id]: cur,
      };
    }, {});

    dispatch({
      type: DocumentActionType.POPULATE_DOCUMENTS,
      payload: {
        documentList: { data: list },
      },
    });
  }, [data, dispatch]);

  const uploadFile = useCallback(
    async (file: File) => {
      const data = new FormData();
      data.append("file", file);

      dispatch({
        type: DocumentActionType.LOADING_CHANGE,
        payload: {
          isLoading: true,
        },
      });

      try {
        const response = await upload(data);
        if (pagination.currentPage === 1) {
          await refetch();
        }

        return response.data;
      } catch (error) {
        throw error;
      } finally {
        dispatch({
          type: DocumentActionType.LOADING_CHANGE,
          payload: {
            isLoading: false,
          },
        });
      }
    },
    [dispatch, pagination.currentPage]
  );

  return (
    <DocumentContext.Provider value={{ state, dispatch, uploadFile }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);

  if (context === undefined)
    throw new Error(
      "useDocumentContext must be used within a DocumentProvider"
    );

  return context;
};
