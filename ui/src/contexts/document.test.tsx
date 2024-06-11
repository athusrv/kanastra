import { documents } from "@/__mocks__/data";
import { Document, DocumentStatus } from "@/models/document";
import { DocumentActionType } from "@/types";
import { faker } from "@faker-js/faker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { APIProvider } from "./api";
import { DocumentProvider, useDocumentContext } from "./document";

const client = new QueryClient();

const render = () =>
  renderHook(useDocumentContext, {
    wrapper: ({ children }) => {
      return (
        <QueryClientProvider client={client}>
          <APIProvider>
            <DocumentProvider>{children}</DocumentProvider>
          </APIProvider>
        </QueryClientProvider>
      );
    },
  });

it("dispatch loading change event", () => {
  const { result } = render();
  expect(result.current.state.isLoading).toBeFalsy();
  act(() =>
    result.current.dispatch({
      type: DocumentActionType.LOADING_CHANGE,
      payload: {
        isLoading: true,
      },
    })
  );
  expect(result.current.state.isLoading).toBeTruthy();
});

it("after initial loading, dispatch populate documents event should be triggered and the list should be populated", () => {
  const { result } = render();
  expect(result.current.state.documentList.size).toBe(documents.length);
});

it("set document status", () => {
  const { result } = render();
  act(() => {
    result.current.dispatch({
      type: DocumentActionType.SET_STATUS_COMPLETE,
      payload: {
        document: documents[0],
      },
    });
  });

  expect(
    result.current.state.documentList.data?.[documents[0].id].status
  ).toEqual(DocumentStatus.COMPLETE);
});

it("throws error if try to set status to an invalid document", () => {
  const { result } = render();

  const action = () => {
    act(() => {
      result.current.dispatch({
        type: DocumentActionType.SET_STATUS_COMPLETE,
        payload: {
          document: null,
        },
      });
    });
  };

  expect(action).toThrow();
});

it("adds a new document if not present when setting doc's status", () => {
  const { result } = render();
  const previousSize = result.current.state.documentList.size || 0;

  act(() => {
    result.current.dispatch({
      type: DocumentActionType.SET_STATUS_COMPLETE,
      payload: {
        document: {
          ...documents[0],
          id: faker.string.uuid(),
        },
      },
    });
  });

  expect(result.current.state.documentList.size).toBe(previousSize + 1);
});

it("uploads the file", async () => {
  const { result } = render();
  const file = new File(["Hey!!"], "input.csv", { type: "text/csv" });
  let document: Document | null = null;
  await act(async () => {
    document = await result.current.uploadFile(file);
  });

  expect(document).toBeTruthy();
});
