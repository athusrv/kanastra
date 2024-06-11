import * as utils from "@/lib/utils";
import { Document, DocumentStatus } from "@/models/document";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { DocumentItem, statusToText } from "./document-item";

const mockDocument: Document = {
  filename: "file",
  id: "fakeId",
  status: DocumentStatus.COMPLETE,
};

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

test("render button and check onClick event", async () => {
  render(
    <table>
      <tbody>
        <DocumentItem document={mockDocument} />
      </tbody>
    </table>
  );

  const cells = await screen.findAllByRole("cell");
  expect(cells).toHaveLength(3);
  expect(cells[0]).toHaveTextContent(mockDocument.id);
  expect(cells[1]).toHaveTextContent(mockDocument.filename);
  expect(cells[2]).toHaveTextContent(statusToText[mockDocument.status]);
});

test("should connect to an event source", async () => {
  await act(async () => {
    render(
      <table>
        <tbody>
          <DocumentItem
            document={{ ...mockDocument, status: DocumentStatus.PROCESSING }}
          />
        </tbody>
      </table>
    );
  });

  expect(eventSourceMock.mock.lastCall).toContain(
    `${process.env.API_URL}/events/${mockDocument.id}`
  );
  expect(addEventListenerMock).toHaveBeenCalledTimes(2);
});

test("should not connect to an event source", async () => {
  await act(async () => {
    render(
      <table>
        <tbody>
          <DocumentItem document={mockDocument} />
        </tbody>
      </table>
    );
  });

  expect(addEventListenerMock).not.toHaveBeenCalled();
});
