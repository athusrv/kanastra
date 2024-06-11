import { documents } from "@/__mocks__/data";
import * as utils from "@/lib/utils";
import { Providers } from "@/providers";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { Main } from "./main";
import { DocumentStatus, PaginatedDocuments } from "@/models/document";
import { server } from "@/__mocks__/server";
import { HttpResponse, http } from "msw";
import { faker } from "@faker-js/faker";

const eventSourceMock = jest.spyOn(utils, "newEventSource");

const addEventListenerMock = jest.fn();

eventSourceMock.mockReturnValue({
  CONNECTING: 0,
  CLOSED: 2,
  OPEN: 1,
  dispatchEvent(): boolean {
    return false;
  },
  onerror: jest.fn(),
  onmessage: jest.fn(),
  onopen: jest.fn(),
  readyState: 0,
  url: "",
  withCredentials: false,
  addEventListener: addEventListenerMock,
  close(): void {},
  removeEventListener(): void {},
});

beforeEach(() => {
  addEventListenerMock.mockReset();
});

const UiWrapper = ({ children }: { children: ReactNode }) => {
  return <Providers>{children}</Providers>;
};

const renderUi = () => {
  return render(<Main />, { wrapper: UiWrapper });
};

it("it should render the initial ui", async () => {
  const component = renderUi();
  expect(
    await component.findByText("Name:", { exact: true, trim: true })
  ).toBeDefined();
  expect(
    await component.findByText("Type:", { exact: true, trim: true })
  ).toBeDefined();
  expect(
    await component.findByText("Size: bytes", { exact: true, trim: true })
  ).toBeDefined();
  expect((await component.findAllByTestId("item-row")).length).toBe(
    documents.length
  );
});

it("when upload a file, it should show the file in the list and attach two event handlers listening for the events", async () => {
  const component = renderUi();

  const el = await component.findByTestId("file-input");
  const file = new File([""], "input.csv", { type: "text/csv" });
  await userEvent.upload(el, file);

  expect(await component.findByText(`Name: ${file.name}`)).toBeDefined();

  server.use(
    http.get<any, PaginatedDocuments>(
      `${process.env.API_URL || ""}/document`,
      ({ request }) => {
        const url = new URL(request.url);
        const offset = Number(url.searchParams.get("offset") || 0);
        const take = Number(url.searchParams.get("take") || 20);

        return HttpResponse.json<PaginatedDocuments>({
          documents: [
            {
              filename: faker.string.alpha(10),
              id: faker.string.uuid(),
              status: DocumentStatus.PROCESSING,
            },
            ...documents.slice(offset, offset + take),
          ],
          offset,
          take,
          total: documents.length,
        });
      }
    )
  );
  const button = await component.findByTestId("upload-button");
  await userEvent.click(button);

  expect((await component.findAllByTestId("item-row")).length).toBe(
    documents.length + 1
  );

  expect(addEventListenerMock).toHaveBeenCalled();
});
