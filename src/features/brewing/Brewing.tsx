import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Navigate, useBlocker, useNavigate, useParams } from "react-router-dom";
import {
  AppHeader,
  BottomNavigation,
  HomeIndicator,
} from "../../components/layout/Chrome";
import { Modal } from "../../components/ui/Modal";
import { getTea } from "../../data/teas";
import { useApp } from "../../store/appContext";
import { useBrewTimer } from "../../hooks/useBrewTimer";
import { modeLabels, waterLabels } from "../../store/types";
import type { BrewSettings, DrinkMode, WaterSource } from "../../store/types";
import "./brewing.css";
export function formatDuration(duration: number) {
  const min = Math.floor(duration / 60),
    sec = duration % 60;
  return (
    [min ? `${min}분` : "", sec ? `${sec}초` : ""].filter(Boolean).join(" ") ||
    "0초"
  );
}
export function BrewingSetup() {
  const { teaId = "" } = useParams();
  const tea = getTea(teaId);
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<BrewSettings>(() =>
    state.selected?.teaId === teaId
      ? state.selected
      : {
          teaId,
          drinkMode: "hot",
          waterSource: "purified",
          duration:
            teaId === "chamomile" ? 150 : (tea?.recommendedDuration ?? 150),
        },
  );
  if (!tea) return <Navigate to="/home" replace />;
  const iced = settings.drinkMode === "iced";
  function mode(drinkMode: DrinkMode) {
    setSettings((s) => ({
      ...s,
      drinkMode,
      duration:
        drinkMode === "iced"
          ? tea!.icedDuration
          : teaId === "chamomile"
            ? 150
            : tea!.recommendedDuration,
    }));
  }
  function start() {
    const startedAt = Date.now();
    dispatch({
      type: "START",
      timer: {
        ...settings,
        id: crypto.randomUUID(),
        startedAt,
        endsAt: startedAt + settings.duration * 1000,
      },
    });
    navigate("/timer");
  }
  return (
    <main className={`page brewing-page ${iced ? "is-iced" : ""}`}>
      {!iced && <AppHeader />}
      <div className="brewing-content">
        <div className="page-heading">
          <h1 className="screen-title">{tea.name}</h1>
          <p>나만의 차 만들기</p>
        </div>
        <div className="brewing-controls">
          <div className="segmented" role="group" aria-label="음용 방식">
            {(["hot", "iced"] as const).map((m) => (
              <button
                key={m}
                aria-pressed={settings.drinkMode === m}
                className={settings.drinkMode === m ? "active" : ""}
                onClick={() => mode(m)}
              >
                {modeLabels[m]}
              </button>
            ))}
          </div>
          {iced ? (
            <div className="iced-instructions">
              <strong>시원하게 드실 수 있게 진하게 우려드려요</strong>
              <p>우린 뒤 얼음에 바로 부어주세요</p>
            </div>
          ) : (
            <div className="water-options" role="group" aria-label="물 종류">
              {(Object.keys(waterLabels) as WaterSource[]).map((w) => (
                <button
                  key={w}
                  aria-pressed={settings.waterSource === w}
                  className={settings.waterSource === w ? "active" : ""}
                  onClick={() => setSettings((s) => ({ ...s, waterSource: w }))}
                >
                  {waterLabels[w]}
                </button>
              ))}
            </div>
          )}
          <div
            className="time-slider"
            style={
              {
                "--handle-width": `${Math.max(92, Math.min(354, settings.duration - 38))}px`,
              } as CSSProperties
            }
          >
            <div className="time-handle">
              <output htmlFor="brew-duration">
                {formatDuration(settings.duration)}
              </output>
            </div>
            <input
              id="brew-duration"
              type="range"
              min="30"
              max="600"
              step="30"
              value={settings.duration}
              aria-label="우림 시간"
              aria-valuemin={30}
              aria-valuemax={600}
              aria-valuenow={settings.duration}
              aria-valuetext={formatDuration(settings.duration)}
              onChange={(e) =>
                setSettings((s) => ({ ...s, duration: Number(e.target.value) }))
              }
            />
          </div>
          <button className="brew-start" onClick={start}>
            나만의 차 마셔보기 →
          </button>
        </div>
      </div>
      {!iced && (
        <div className="solo-indicator">
          <HomeIndicator />
        </div>
      )}
    </main>
  );
}
export function Timer() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { remaining, progress } = useBrewTimer(state.timer);
  const blocker = useBlocker(
    ({ nextLocation }) =>
      !!state.timer &&
      nextLocation.pathname !== "/timer" &&
      nextLocation.pathname !== "/success",
  );
  useEffect(() => {
    if (state.timer && remaining === 0) {
      dispatch({ type: "COMPLETE", id: state.timer.id, now: Date.now() });
      navigator.vibrate?.(100);
    }
  }, [dispatch, remaining, state.timer]);
  useEffect(() => {
    if (!state.timer && blocker.state === "unblocked")
      navigate(state.lastRecordId ? "/success" : "/home", { replace: true });
  }, [state.timer, state.lastRecordId, blocker.state, navigate]);
  if (!state.timer) return null;
  const tea = getTea(state.timer.teaId);
  const minutes = Math.floor(remaining / 60),
    seconds = String(remaining % 60).padStart(2, "0");
  return (
    <main className="page timer-page">
      <div
        className="timer-fill"
        data-progress={progress.toFixed(4)}
        style={{ "--progress": progress } as CSSProperties}
      />
      <AppHeader transparent />
      <div className="timer-content">
        <h1>
          {state.timer.drinkMode === "iced" ? "시원한" : "따뜻한"} {tea?.name}이
          <br />
          우려지고 있어요
        </h1>
        <p
          role="timer"
          aria-label={`남은 시간 ${formatDuration(remaining)}`}
          aria-live="off"
        >
          {minutes} : {seconds}
        </p>
        <span
          className="sr-only"
          role="progressbar"
          aria-label="우림 진행률"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        />
      </div>
      <BottomNavigation />
      {blocker.state === "blocked" && (
        <Modal title="우림을 멈출까요?" onClose={() => blocker.reset()}>
          <h2>우림을 멈출까요?</h2>
          <p>지금 나가면 우림이 취소되고 기록은 저장되지 않아요.</p>
          <div className="modal-actions">
            <button onClick={() => blocker.reset()}>계속 우리기</button>
            <button
              className="primary-button"
              onClick={() => {
                dispatch({ type: "CANCEL" });
                blocker.proceed();
              }}
            >
              우림 취소
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
export function Success() {
  const { state } = useApp();
  const navigate = useNavigate();
  const record = state.records.find((r) => r.id === state.lastRecordId);
  const tea = getTea(record?.teaId ?? "chamomile");
  const exact =
    !record || (record.teaId === "chamomile" && record.drinkMode === "iced");
  return (
    <main className="page success-page">
      <AppHeader onBack={() => navigate("/home")} />
      <div className="success-content">
        <div className="success-message">
          <h1>오늘의 한 잔</h1>
          <p>
            라이브러리에서 언제든
            <br />
            다시 볼 수 있어요.
          </p>
        </div>
        {exact ? (
          <div className="success-tea">
            <img
              src="/assets/images/chamomile-ice.png"
              alt="시원한 캐모마일 한 잔"
            />
          </div>
        ) : tea?.image ? (
          <img
            className="success-other-tea"
            src={tea.image}
            alt={`${tea.name} 한 잔`}
          />
        ) : (
          <div className="success-no-image">{tea?.name}</div>
        )}
        <button
          className="primary-button"
          onClick={() =>
            navigate(`/library?tea=${record?.teaId ?? "chamomile"}`)
          }
        >
          기록 보기
        </button>
      </div>
      <BottomNavigation />
    </main>
  );
}
