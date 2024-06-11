import {
  Document,
  DocumentStatus,
  PaginatedDocuments,
} from "@/models/document";
import { faker } from "@faker-js/faker";
import { HttpResponse, http } from "msw";
import { documents } from "./data";

export const handlers = [
  http.get<{ id: string }, Document>(
    `${process.env.API_URL || ""}/document/:id`,
    ({ params }) => {
      return HttpResponse.json<Document>({
        ...documents[0],
        id: params.id,
      });
    }
  ),
  http.get<any, PaginatedDocuments>(
    `${process.env.API_URL || ""}/document`,
    ({ request }) => {
      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset") || 0);
      const take = Number(url.searchParams.get("take") || 20);

      return HttpResponse.json<PaginatedDocuments>({
        documents: documents.slice(offset, offset + take),
        offset,
        take,
        total: documents.length,
      });
    }
  ),
  http.post(`${process.env.API_URL || ""}/document`, async ({ request }) => {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return new HttpResponse("Missing document", { status: 400 });
    }

    return HttpResponse.json<Document>({
      filename: (file as File).name || faker.string.alpha(10),
      id: faker.string.uuid(),
      status: DocumentStatus.PROCESSING,
    });
  }),
];
