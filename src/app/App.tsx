import { RouterProvider } from "react-router-dom";
import { AppProvider } from "../store/appContext";
import { router } from "./router";
export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
