import { seedRecords, seedPreferences } from "../data/seed";
import type {
  AppState,
  BrewSettings,
  BrewTimer,
  Session,
  DrinkMode,
} from "./types";
export const STORAGE_KEY = "t100.app.v1";
export function initialState(seeded = true): AppState {
  return {
    version: 1,
    session: null,
    selected: null,
    timer: null,
    records: seeded ? seedRecords.map((r) => ({ ...r })) : [],
    preferences: seeded ? seedPreferences.map((r) => ({ ...r })) : [],
    lastRecordId: null,
    notifications: false,
    defaultDrinkMode: "hot",
  };
}
export type Action =
  | { type: "LOGIN"; session: Session }
  | { type: "LOGOUT" }
  | { type: "DELETE_ACCOUNT" }
  | { type: "SELECT"; settings: BrewSettings }
  | { type: "START"; timer: BrewTimer }
  | { type: "CANCEL" }
  | { type: "COMPLETE"; id: string; now: number }
  | { type: "UPDATE_NAME"; name: string }
  | { type: "NOTIFICATIONS"; enabled: boolean }
  | { type: "DEFAULT_MODE"; mode: DrinkMode }
  | { type: "SYNC"; state: AppState };
export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, session: action.session };
    case "LOGOUT":
      return { ...state, session: null, timer: null };
    case "DELETE_ACCOUNT":
      return initialState(false);
    case "SELECT":
      return { ...state, selected: action.settings };
    case "START":
      return { ...state, selected: action.timer, timer: action.timer };
    case "CANCEL":
      return { ...state, timer: null };
    case "COMPLETE": {
      const t = state.timer;
      if (!t || t.id !== action.id || action.now < t.endsAt) return state;
      const { teaId, drinkMode, waterSource, duration } = t;
      const pref = { teaId, drinkMode, waterSource, duration };
      return {
        ...state,
        timer: null,
        lastRecordId: t.id,
        records: state.records.some((r) => r.id === t.id)
          ? state.records
          : [
              ...state.records,
              {
                ...pref,
                id: t.id,
                brewedAt: new Date(t.endsAt).toISOString(),
                count: 1,
              },
            ],
        preferences: [
          ...state.preferences.filter((p) => p.teaId !== teaId),
          pref,
        ],
      };
    }
    case "UPDATE_NAME":
      return {
        ...state,
        session: state.session ? { ...state.session, name: action.name } : null,
      };
    case "NOTIFICATIONS":
      return { ...state, notifications: action.enabled };
    case "DEFAULT_MODE":
      return { ...state, defaultDrinkMode: action.mode };
    case "SYNC":
      return action.state;
  }
}
const obj = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object";
const settings = (x: unknown) =>
  obj(x) &&
  typeof x.teaId === "string" &&
  ["hot", "iced"].includes(String(x.drinkMode)) &&
  ["purified", "boiled", "bottled"].includes(String(x.waterSource)) &&
  typeof x.duration === "number" &&
  Number.isFinite(x.duration) &&
  x.duration > 0 &&
  x.duration <= 3600;
export function parseStoredState(raw: string | null): AppState | null {
  try {
    const x: unknown = JSON.parse(raw ?? "null");
    if (
      !obj(x) ||
      x.version !== 1 ||
      !Array.isArray(x.records) ||
      !Array.isArray(x.preferences)
    )
      return null;
    if (
      !x.records.every(
        (r) =>
          settings(r) &&
          obj(r) &&
          typeof r.id === "string" &&
          typeof r.brewedAt === "string" &&
          Number.isFinite(Date.parse(r.brewedAt)) &&
          Number.isInteger(r.count) &&
          Number(r.count) > 0,
      ) ||
      !x.preferences.every(settings)
    )
      return null;
    if (
      x.session !== null &&
      (!obj(x.session) ||
        typeof x.session.name !== "string" ||
        typeof x.session.email !== "string" ||
        typeof x.session.provider !== "string")
    )
      return null;
    if (
      x.timer !== null &&
      (!settings(x.timer) ||
        !obj(x.timer) ||
        typeof x.timer.id !== "string" ||
        typeof x.timer.startedAt !== "number" ||
        typeof x.timer.endsAt !== "number" ||
        !Number.isFinite(x.timer.startedAt) ||
        !Number.isFinite(x.timer.endsAt) ||
        x.timer.endsAt <= x.timer.startedAt)
    )
      return null;
    if (x.selected !== null && !settings(x.selected)) return null;
    return { ...initialState(false), ...x } as AppState;
  } catch {
    return null;
  }
}
