import { newEventSource } from "@/lib/utils";
import { Document, DocumentStatus } from "@/models/document";
import { DocumentActionType } from "@/types";
import { BorderDottedIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useDocumentContext } from "../../contexts/document";
import { TableCell, TableRow } from "./table";

export const statusToText: Record<DocumentStatus, string> = {
  [DocumentStatus.PROCESSING]: "Processing",
  [DocumentStatus.COMPLETE]: "Finished",
  [DocumentStatus.FAILED]: "Failed",
};

const Icons: Record<DocumentStatus, ReactNode> = {
  [DocumentStatus.PROCESSING]: (
    <BorderDottedIcon className="h-3 w-3 animate-spin" />
  ),
  [DocumentStatus.COMPLETE]: <CheckIcon className="h-4 w-4 text-green-500" />,
  [DocumentStatus.FAILED]: <Cross2Icon className="h-4 w-4 text-red-500" />,
};

export const DocumentItem = ({ document }: { document: Document }) => {
  const file = useDocumentContext();

  const updateStatus = useCallback(
    (
      type:
        | DocumentActionType.SET_STATUS_COMPLETE
        | DocumentActionType.SET_STATUS_FAILURE
    ) => {
      file.dispatch({
        type,
        payload: {
          document: document,
        },
      });
    },
    [document]
  );

  useEffect(() => {
    if (
      document.status === DocumentStatus.COMPLETE ||
      document.status === DocumentStatus.FAILED
    )
      return;

    const es = newEventSource(`${process.env.API_URL}/events/${document.id}`);
    es.addEventListener("complete", () => {
      updateStatus(DocumentActionType.SET_STATUS_COMPLETE);
      toast(`${document.filename} was processed successfuly`, {
        description: "The file status was updated accordingly",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    });
    es.addEventListener("failed", () => {
      updateStatus(DocumentActionType.SET_STATUS_FAILURE);
      toast(`Ops! ${document.filename} failed processing`, {
        description:
          "Check if the file is well formatted and its content contains only valid data types",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    });

    return () => {
      es.close();
    };
  }, [document]);

  return (
    <TableRow role="row" data-testid="item-row">
      <TableCell role="cell">{document.id}</TableCell>
      <TableCell role="cell">{document.filename}</TableCell>
      <TableCell role="cell">
        <div className="flex flex-grow gap-2 items-center w-full">
          {Icons[document.status]}
          <p className="w-full">{statusToText[document.status]}</p>
        </div>
      </TableCell>
    </TableRow>
  );
};
