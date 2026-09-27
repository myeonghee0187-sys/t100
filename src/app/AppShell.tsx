import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
export function AppShell() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
