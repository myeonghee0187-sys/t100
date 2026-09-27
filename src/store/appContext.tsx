import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from "react";
import type { Dispatch, ReactNode } from "react";
import {
  appReducer,
  initialState,
  parseStoredState,
  STORAGE_KEY,
} from "./appReducer";
import type { Action } from "./appReducer";
import type { AppState } from "./types";
const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
  notify: (message: string) => void;
} | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => {
    try {
      return (
        parseStoredState(localStorage.getItem(STORAGE_KEY)) ?? initialState()
      );
    } catch {
      return initialState();
    }
  });
  const [toast, setToast] = useState("");
  const notify = useCallback((message: string) => setToast(message), []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setToast(
        "저장 공간을 사용할 수 없어 이번 기록은 이 화면에서만 유지돼요.",
      );
    }
  }, [state]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3600);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next = parseStoredState(e.newValue);
        if (next) dispatch({ type: "SYNC", state: next });
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <AppContext.Provider value={{ state, dispatch, notify }}>
      {children}
      {toast && (
        <div role="status" className="toast">
          {toast}
        </div>
      )}
    </AppContext.Provider>
  );
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("AppProvider is required");
  return value;
}
