import { render } from "@testing-library/react";
import { FileUploader } from "./file-uploader";
import userEvent from "@testing-library/user-event";
import { prepareDocumentContext } from "@/test/utilts";
import "@testing-library/jest-dom";

test("should upload a file", async () => {
  const uploadFileMock = jest.fn(() => Promise.resolve());
  prepareDocumentContext([], false, jest.fn(), uploadFileMock);
  const component = render(<FileUploader />);

  const el = await component.findByTestId("file-input");
  const button = await component.findByTestId("upload-button");
  const file = new File([""], "input.csv", { type: "text/csv" });
  await userEvent.upload(el, file);

  expect(component.container).toHaveTextContent(`Name: ${file.name}`);
  expect(component.container).toHaveTextContent(`Type: ${file.type}`);
  expect(component.container).toHaveTextContent(`Size: ${file.size} bytes`);

  await userEvent.click(button);

  expect(uploadFileMock).toHaveBeenCalledWith(file);
  expect(button.attributes["disabled" as any]).not.toBeDefined();
});

test("button should be disabled when loading document", async () => {
  const uploadFileMock = jest.fn(() => Promise.resolve());
  prepareDocumentContext([], true, jest.fn(), uploadFileMock);
  const component = render(<FileUploader />);

  const button = await component.findByTestId("upload-button");

  expect(button.attributes["disabled" as any]).toBeDefined();
});
