import { useDocumentContext } from "@/contexts/document";
import { DocumentItem } from "./document-item";
import { DocumentsPagination } from "./document-pagination";
import { NoResults } from "./no-results";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./table";

export const DocumentList = () => {
  const file = useDocumentContext();

  return (
    <div className="flex flex-col overflow-hidden flex-grow">
      <h1 className="font-bold text-lg">File list</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        {!!file.state.documentList.size && (
          <TableBody data-testid="documents-table-body">
            {Object.entries(file.state.documentList.data || {}).map(
              ([key, document]) => (
                <DocumentItem key={key} document={document} />
              )
            )}
          </TableBody>
        )}
      </Table>
      {!file.state.documentList.size && <NoResults />}
      <DocumentsPagination />
    </div>
  );
};
