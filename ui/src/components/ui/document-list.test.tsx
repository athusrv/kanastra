import { DocumentStatus } from "@/models/document";
import { prepareDocumentContext } from "@/test/utilts";
import { render } from "@testing-library/react";
import { DocumentList } from "./document-list";

test("should render list of documents", async () => {
  prepareDocumentContext([
    { filename: "fake", id: "1", status: DocumentStatus.COMPLETE },
  ]);

  const component = render(<DocumentList />);
  const el = await component.findByTestId("documents-table-body");

  expect(el).toBeDefined();
});

test("should render the NoResults component", async () => {
  prepareDocumentContext();
  const component = render(<DocumentList />);
  const el = await component.findByTestId("no-results-container");

  expect(el).toBeDefined();
});
