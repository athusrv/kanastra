import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "sonner";
import * as Components from "./components";
import { Providers } from "./providers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <Components.Main />
        <Toaster />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
