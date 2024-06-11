import { Document } from "@/models/document";
import { ReactNode } from "react";

enum DocumentActionType {
  POPULATE_DOCUMENTS,
  SET_STATUS_COMPLETE,
  SET_STATUS_FAILURE,
  ADD_DOCUMENT,
  LOADING_CHANGE,
}

type ReducerAction<T, P> = {
  type: T;
  payload?: Partial<P>;
};

type DocumentList = {
  data: Record<string, Document>;
  size: number;
};

type DocumentContextState = {
  isLoading: boolean;
  documentList: Partial<DocumentList>;
};

type DocumentAction = ReducerAction<
  DocumentActionType,
  DocumentContextState & { document: Document | null }
>;

type DocumentDispatch = ({ type, payload }: DocumentAction) => void;

type DocumentContextType = {
  state: DocumentContextState;
  dispatch: DocumentDispatch;
  uploadFile: (file: File) => Promise<Document | null>;
};

type DocumentProviderProps = { children: ReactNode };

export {
  DocumentActionType,
  type DocumentAction,
  type DocumentContextState,
  type DocumentContextType,
  type DocumentDispatch,
  type DocumentProviderProps,
};
