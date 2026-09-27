export type DrinkMode = "hot" | "iced";
export type WaterSource = "purified" | "boiled" | "bottled";
export interface BrewSettings {
  teaId: string;
  drinkMode: DrinkMode;
  waterSource: WaterSource;
  duration: number;
}
export interface BrewTimer extends BrewSettings {
  id: string;
  startedAt: number;
  endsAt: number;
}
export interface BrewRecord extends BrewSettings {
  id: string;
  brewedAt: string;
  count: number;
}
export interface Session {
  name: string;
  email: string;
  provider: string;
}
export interface AppState {
  version: 1;
  session: Session | null;
  selected: BrewSettings | null;
  timer: BrewTimer | null;
  records: BrewRecord[];
  preferences: BrewSettings[];
  lastRecordId: string | null;
  notifications: boolean;
  defaultDrinkMode: DrinkMode;
}
export const waterLabels: Record<WaterSource, string> = {
  purified: "정수기 온수",
  boiled: "끓인 물",
  bottled: "생수",
};
export const modeLabels: Record<DrinkMode, string> = {
  hot: "따뜻하게",
  iced: "시원하게",
};
