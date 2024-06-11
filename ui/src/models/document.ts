export enum DocumentStatus {
  PROCESSING = "PROCESSING",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface Document {
  id: string;
  filename: string;
  status: DocumentStatus;
}

export interface PaginatedDocuments {
  documents: Document[];
  total: number;
  offset: number;
  take: number;
}
