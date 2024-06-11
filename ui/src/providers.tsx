import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIProvider } from "./contexts/api";
import { DocumentProvider } from "./contexts/document";
import { PaginationProvider } from "./contexts/pagination";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const contexts: React.ElementType[] = [
    APIProvider,
    PaginationProvider,
    DocumentProvider,
  ];

  return (
    <QueryClientProvider client={queryClient}>
      {contexts.reduceRight(
        (child, Context) => (
          <Context>{child}</Context>
        ),
        children
      )}
    </QueryClientProvider>
  );
};
