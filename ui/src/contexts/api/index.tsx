import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { Endpoints, getEndpoints } from "./endpoints";

const api = axios.create({
  baseURL: process.env.API_URL || "", // ideally this should come from a environment variable
});

export const APIContext = createContext<Endpoints>({} as Endpoints);

export const APIProvider = ({ children }: { children: ReactNode }) => (
  <APIContext.Provider value={getEndpoints(api)}>
    {children}
  </APIContext.Provider>
);

export const useAPI = () => useContext(APIContext);
