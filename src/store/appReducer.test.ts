import { describe, expect, it } from "vitest";
import { appReducer, initialState, parseStoredState } from "./appReducer";
import { timerSnapshot } from "../hooks/useBrewTimer";
const timer = {
  id: "test-brew",
  teaId: "chamomile",
  drinkMode: "iced" as const,
  waterSource: "boiled" as const,
  duration: 180,
  startedAt: 1000,
  endsAt: 181000,
};
describe("우림 저장과 복원", () => {
  it("완료 시각 이전에는 저장하지 않고 완료 후 동일 ID를 한 번만 저장한다", () => {
    const state = { ...initialState(), timer };
    expect(
      appReducer(state, { type: "COMPLETE", id: timer.id, now: 180999 }),
    ).toBe(state);
    const once = appReducer(state, {
      type: "COMPLETE",
      id: timer.id,
      now: 190000,
    });
    const twice = appReducer(once, {
      type: "COMPLETE",
      id: timer.id,
      now: 200000,
    });
    expect(twice.records.filter((r) => r.id === timer.id)).toEqual([
      {
        id: timer.id,
        teaId: "chamomile",
        drinkMode: "iced",
        waterSource: "boiled",
        duration: 180,
        count: 1,
        brewedAt: new Date(181000).toISOString(),
      },
    ]);
    expect(
      twice.preferences.find((p) => p.teaId === "chamomile")?.duration,
    ).toBe(180);
    expect(twice.timer).toBeNull();
  });
  it("취소한 타이머나 다른 ID의 콜백은 기록을 만들지 않는다", () => {
    const state = initialState();
    expect(
      appReducer(state, { type: "COMPLETE", id: timer.id, now: 200000 }),
    ).toBe(state);
    const running = { ...state, timer };
    expect(
      appReducer(running, { type: "COMPLETE", id: "stale", now: 200000 }),
    ).toBe(running);
    expect(appReducer(running, { type: "CANCEL" }).records).toHaveLength(6);
  });
  it("탭이 오래 비활성 상태여도 종료 시각으로 계산한다", () => {
    expect(timerSnapshot(timer, 91000)).toEqual({
      remaining: 90,
      progress: 0.5,
    });
    expect(timerSnapshot(timer, 300000)).toEqual({ remaining: 0, progress: 1 });
    expect(timerSnapshot(timer, 0).progress).toBe(0);
  });
  it("진행 중인 세션과 빈 기록을 새로고침 후 복원한다", () => {
    const state = { ...initialState(false), timer };
    expect(parseStoredState(JSON.stringify(state))).toEqual(state);
    expect(
      parseStoredState(
        JSON.stringify(appReducer(initialState(), { type: "DELETE_ACCOUNT" })),
      )?.records,
    ).toEqual([]);
  });
  it("손상된 JSON과 비정상 저장값을 거부한다", () => {
    for (const raw of [
      "{bad",
      "{}",
      JSON.stringify({
        ...initialState(),
        timer: { ...timer, endsAt: "later" },
      }),
      JSON.stringify({ ...initialState(), records: [{ count: -1 }] }),
      JSON.stringify({
        ...initialState(),
        preferences: [{ ...timer, duration: Infinity }],
      }),
    ])
      expect(parseStoredState(raw)).toBeNull();
  });
  it("탈퇴 시 세션, 기록, 개인값, 진행 중 우림을 비운다", () => {
    const result = appReducer(
      {
        ...initialState(),
        timer,
        session: { name: "지훈", email: "test@example.com", provider: "email" },
      },
      { type: "DELETE_ACCOUNT" },
    );
    expect(result).toEqual(initialState(false));
  });
});
