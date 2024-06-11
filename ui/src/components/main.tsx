import * as Components from ".";

export const Main = () => {
  return (
    <div className="p-6 flex gap-8 h-screen max-md:flex-col">
      <div className="flex-grow">
        <Components.FileUploader />
      </div>
      <div className="flex flex-col flex-grow overflow-auto">
        <Components.DocumentList />
      </div>
    </div>
  );
};
