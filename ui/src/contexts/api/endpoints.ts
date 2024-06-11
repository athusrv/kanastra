import { Document, PaginatedDocuments } from "@/models/document";
import { AxiosInstance, AxiosResponse } from "axios";

export interface Endpoints {
  upload: (data: FormData) => Promise<AxiosResponse<Document>>;
  getDocuments: (
    offset?: number,
    take?: number
  ) => Promise<AxiosResponse<PaginatedDocuments>>;
  getDocument: (id: string) => Promise<AxiosResponse<Document>>;
}

export const getEndpoints = (api: AxiosInstance): Endpoints => ({
  upload: async (data) =>
    api.post("/document", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getDocuments: async (offset = 0, take = 20) =>
    api.get<PaginatedDocuments>("/document", {
      params: {
        offset,
        take,
      },
    }),
  getDocument: async (id) => api.get<Document>(`/document/${id}`),
});
