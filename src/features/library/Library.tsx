import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AppHeader,
  BottomNavigation,
  HomeIndicator,
} from "../../components/layout/Chrome";
import { Modal } from "../../components/ui/Modal";
import { useApp } from "../../store/appContext";
import { getTea } from "../../data/teas";
import type { BrewRecord } from "../../store/types";
import { waterLabels } from "../../store/types";
import { formatDuration } from "../brewing/Brewing";
import "./library.css";
export function aggregateRecords(records: BrewRecord[]) {
  const groups = new Map<
    string,
    { teaId: string; count: number; latest: BrewRecord }
  >();
  for (const r of records) {
    const group = groups.get(r.teaId);
    if (group) {
      group.count += r.count;
      if (Date.parse(r.brewedAt) > Date.parse(group.latest.brewedAt))
        group.latest = r;
    } else groups.set(r.teaId, { teaId: r.teaId, count: r.count, latest: r });
  }
  return [...groups.values()];
}
export function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}
const designOrder = [
  "hibiscus",
  "green-tea",
  "barley",
  "peppermint",
  "chamomile",
  "butterfly-pea",
];
export function Library() {
  const { state, dispatch } = useApp();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const groups = aggregateRecords(state.records);
  const selected = groups.find((g) => g.teaId === params.get("tea"));
  const tea = selected && getTea(selected.teaId);
  const pref =
    selected &&
    (state.preferences.find((p) => p.teaId === selected.teaId) ??
      selected.latest);
  const ordered = [...groups].sort((a, b) => {
    const ai = designOrder.indexOf(a.teaId),
      bi = designOrder.indexOf(b.teaId);
    return (ai < 0 ? 6 : ai) - (bi < 0 ? 6 : bi);
  });
  function close() {
    setParams({}, { replace: true });
  }
  return (
    <main className="page library-page">
      <div className="library-background" aria-hidden="true">
        {["mint", "brown", "pink", "green", "yellow", "blue"].map((color) => (
          <img
            key={color}
            className={`gradient-${color}`}
            src={`/assets/images/gradient-${color}.svg`}
            alt=""
          />
        ))}
      </div>
      <AppHeader library transparent />
      {ordered.length ? (
        <div className="library-timeline">
          <div className="library-axis" aria-hidden="true">
            <img src="/assets/icons/library-axis.svg" alt="" />
          </div>
          {ordered.map((group, index) => (
            <div
              className={`record-row ${index % 2 ? "left" : "right"}`}
              key={group.teaId}
            >
              <button
                aria-haspopup="dialog"
                aria-expanded={selected?.teaId === group.teaId}
                onClick={(e) => {
                  e.currentTarget.focus({ preventScroll: true });
                  setParams({ tea: group.teaId });
                }}
              >
                <strong>{getTea(group.teaId)?.name ?? group.teaId}</strong>
                <span>
                  {group.count}잔 · {shortDate(group.latest.brewedAt)}
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>아직 기록한 차가 없어요.</p>
          <button className="primary-button" onClick={() => navigate("/home")}>
            차 만나기
          </button>
        </div>
      )}
      <div className="library-bottom-blur" />
      {!selected && <BottomNavigation />}
      {selected && tea && pref && (
        <Modal title={`${tea.name} 기록`} onClose={close} sheet>
          <div className="tea-detail">
            {tea.id === "chamomile" ? (
              <div className="detail-flower">
                <img
                  src="/assets/images/chamomile-flower.png"
                  alt="캐모마일 꽃"
                />
              </div>
            ) : tea.image ? (
              <img
                className="detail-tea-photo"
                src={tea.image}
                alt={tea.name}
              />
            ) : (
              <div className="detail-color" style={{ background: tea.color }} />
            )}
            <h2>
              {selected.count}잔의 {tea.name}
            </h2>
            <div className="detail-facts">
              <p>최근 한 잔 {shortDate(selected.latest.brewedAt)}</p>
              <div>
                {tea.caffeine && <span>카페인 {tea.caffeine}</span>}
                {tea.tasteLabel && (
                  <span>
                    {tea.id === "chamomile" ? "은은한 단맛" : tea.tasteLabel}
                  </span>
                )}
                {tea.category && <span>{tea.category}</span>}
              </div>
            </div>
            <div className="detail-preference">
              <h3>내 취향</h3>
              <p>
                {waterLabels[pref.waterSource]} ·{" "}
                {formatDuration(pref.duration)}
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                dispatch({
                  type: "SELECT",
                  settings: {
                    teaId: tea.id,
                    drinkMode: pref.drinkMode,
                    waterSource: pref.waterSource,
                    duration: pref.duration,
                  },
                });
                navigate(`/brew/${tea.id}`);
              }}
            >
              다시 우리기
            </button>
          </div>
          <div className="sheet-indicator">
            <HomeIndicator />
          </div>
        </Modal>
      )}
    </main>
  );
}
