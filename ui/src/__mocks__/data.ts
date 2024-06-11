import { Document, DocumentStatus } from "@/models/document";

export const documents: Document[] = [
  { id: "1", filename: "document1.txt", status: DocumentStatus.PROCESSING },
  { id: "2", filename: "document2.txt", status: DocumentStatus.COMPLETE },
  { id: "3", filename: "document3.txt", status: DocumentStatus.FAILED },
  { id: "4", filename: "document4.txt", status: DocumentStatus.PROCESSING },
  { id: "5", filename: "document5.txt", status: DocumentStatus.COMPLETE },
  { id: "6", filename: "document6.txt", status: DocumentStatus.FAILED },
  { id: "7", filename: "document7.txt", status: DocumentStatus.PROCESSING },
  { id: "8", filename: "document8.txt", status: DocumentStatus.COMPLETE },
  { id: "9", filename: "document9.txt", status: DocumentStatus.FAILED },
  { id: "10", filename: "document10.txt", status: DocumentStatus.PROCESSING },
  { id: "11", filename: "document11.txt", status: DocumentStatus.COMPLETE },
  { id: "12", filename: "document12.txt", status: DocumentStatus.PROCESSING },
  { id: "13", filename: "document13.txt", status: DocumentStatus.FAILED },
  { id: "14", filename: "document14.txt", status: DocumentStatus.COMPLETE },
  { id: "15", filename: "document15.txt", status: DocumentStatus.PROCESSING },
  { id: "16", filename: "document16.txt", status: DocumentStatus.FAILED },
  { id: "17", filename: "document17.txt", status: DocumentStatus.COMPLETE },
  { id: "18", filename: "document18.txt", status: DocumentStatus.PROCESSING },
  { id: "19", filename: "document19.txt", status: DocumentStatus.FAILED },
  { id: "20", filename: "document20.txt", status: DocumentStatus.COMPLETE },
];
