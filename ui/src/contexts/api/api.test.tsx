import { renderHook } from "@testing-library/react";
import { APIProvider, useAPI } from ".";

it("render the api context", () => {
  const { result } = renderHook(useAPI, {
    wrapper: ({ children }) => <APIProvider>{children}</APIProvider>,
  });

  expect(result.current.getDocument).toBeDefined();
  expect(result.current.upload).toBeDefined();
  expect(result.current.getDocuments).toBeDefined();
});
