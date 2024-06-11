import { BorderDottedIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";
import { useDocumentContext } from "../../contexts/document";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const FileUploader = () => {
  const documentContext = useDocumentContext();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = React.useState<File>();

  const handleFileSelected = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const files = Array.from(e.target.files || []);
      setFile(files.at(0));
    },
    [setFile]
  );

  const uploadFile = () => {
    if (!file) return;

    documentContext.uploadFile(file).finally(() => {
      toast(`${file.name} has been sent for processing`, {
        description: "You'll be notified as soon as file has been processed",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
      setFile(undefined);
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="file" className="sr-only">
          Choose a file
        </Label>
        <Input
          ref={inputRef}
          data-testid="file-input"
          id="file"
          type="file"
          onChange={handleFileSelected}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        />
      </div>
      <section>
        <p className="pb-6">File details:</p>
        <ul>
          <li>Name: {file?.name}</li>
          <li>Type: {file?.type}</li>
          <li>Size: {file?.size} bytes</li>
        </ul>
      </section>

      <Button
        data-testid="upload-button"
        className="bg-green-800 hover:bg-green-900"
        disabled={documentContext.state.isLoading}
        onClick={uploadFile}
      >
        {documentContext.state.isLoading && (
          <BorderDottedIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        Upload the file
      </Button>
    </div>
  );
};

export { FileUploader };
