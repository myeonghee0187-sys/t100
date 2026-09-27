import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AppShell } from "./AppShell";
import { useApp } from "../store/appContext";
import { Splash, Auth } from "../features/auth/Auth";
import { Home } from "../features/home/Home";
import { BrewingSetup, Timer, Success } from "../features/brewing/Brewing";
import { Library } from "../features/library/Library";
import { Profile } from "../features/profile/Profile";
function RequireSession() {
  const { state } = useApp();
  return state.session ? <Outlet /> : <Navigate to="/login" replace />;
}
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/splash" replace /> },
      { path: "splash", element: <Splash /> },
      { path: "login", element: <Auth key="login" /> },
      { path: "join", element: <Auth key="join" join /> },
      {
        element: <RequireSession />,
        children: [
          { path: "home", element: <Home /> },
          { path: "brew/:teaId", element: <BrewingSetup /> },
          { path: "timer", element: <Timer /> },
          { path: "success", element: <Success /> },
          { path: "library", element: <Library /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      { path: "*", element: <Navigate to="/splash" replace /> },
    ],
  },
]);
