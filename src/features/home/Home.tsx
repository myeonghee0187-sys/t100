import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader, BottomNavigation } from "../../components/layout/Chrome";
import { TasteMeter } from "../../components/ui/TasteMeter";
import { browseTeaIds, getTea, recommendationTeaIds } from "../../data/teas";
import type { Tea } from "../../data/teas";
import { useApp } from "../../store/appContext";
import "./home.css";
export function Home() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  function select(tea: Tea) {
    const drinkMode = state.defaultDrinkMode;
    dispatch({
      type: "SELECT",
      settings: {
        teaId: tea.id,
        drinkMode,
        waterSource: "purified",
        duration:
          drinkMode === "iced"
            ? tea.icedDuration
            : tea.id === "chamomile"
              ? 150
              : tea.recommendedDuration,
      },
    });
    navigate(`/brew/${tea.id}`);
  }
  return (
    <main className="page home-page">
      <AppHeader />
      <section className="recommendations">
        <div className="page-heading">
          <h1 className="screen-title">오늘의 차</h1>
          <p>지친 하루엔</p>
        </div>
        <RecommendationCarousel onSelect={select} />
      </section>
      <section className="tea-browse">
        <div className="page-heading">
          <h2 className="screen-title">차 둘러보기</h2>
        </div>
        <div className="tea-list">
          {browseTeaIds.map((id) => {
            const tea = getTea(id)!;
            return (
              <button
                key={id}
                className={`tea-card tea-${id}`}
                onClick={() => select(tea)}
              >
                <span className="tea-image">
                  <img src={tea.image} alt={tea.name} loading="lazy" />
                </span>
                <span className="tea-info">
                  <strong>{tea.name}</strong>
                  <span>카페인 {tea.caffeine}</span>
                  <span>
                    {tea.recommendedTemperature}℃ ‧{" "}
                    {tea.recommendedDuration / 60}분
                  </span>
                </span>
                <span className="tea-meters">
                  <TasteMeter label={tea.tasteLabel} score={tea.tasteScore} />
                  <TasteMeter label="탄닌" score={tea.tanninScore} />
                  <TasteMeter label="바디" score={tea.bodyScore} />
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <BottomNavigation />
    </main>
  );
}
function RecommendationCarousel({
  onSelect,
}: {
  onSelect: (tea: Tea) => void;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(
    null,
  );
  const dragging = useRef(false);
  const cards = recommendationTeaIds.map((id) => getTea(id)!);
  const center = (index: number, smooth = true) => {
    const el = rail.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2,
      behavior:
        smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "smooth"
          : "instant",
    });
  };
  useLayoutEffect(() => {
    center(1, false);
  }, []);
  useEffect(() => () => clearTimeout(timeout.current), []);
  return (
    <div
      className="carousel"
      ref={rail}
      role="region"
      aria-label="오늘의 차 추천"
      aria-roledescription="캐러셀"
      tabIndex={0}
      onScroll={() => {
        const el = rail.current!;
        const c = el.scrollLeft + el.clientWidth / 2;
        const distances = Array.from(el.children).map((n) => {
          const x = n as HTMLElement;
          return Math.abs(x.offsetLeft + x.clientWidth / 2 - c);
        });
        setActive(distances.indexOf(Math.min(...distances)));
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          center(
            Math.max(
              0,
              Math.min(2, active + (e.key === "ArrowRight" ? 1 : -1)),
            ),
          );
        }
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") return;
        drag.current = {
          x: e.clientX,
          scroll: e.currentTarget.scrollLeft,
          moved: false,
        };
        dragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const d = e.clientX - drag.current.x;
        if (Math.abs(d) > 6) {
          drag.current.moved = true;
          dragging.current = true;
          e.currentTarget.style.scrollSnapType = "none";
          e.currentTarget.setPointerCapture(e.pointerId);
          e.currentTarget.scrollLeft = drag.current.scroll - d;
        }
      }}
      onPointerUp={(e) => {
        if (drag.current?.moved) {
          const el = e.currentTarget;
          const projected = drag.current.scroll + drag.current.x - e.clientX;
          const distances = Array.from(el.children).map((n) => {
            const c = n as HTMLElement;
            return Math.abs(
              c.offsetLeft + c.clientWidth / 2 - projected - el.clientWidth / 2,
            );
          });
          const target = distances.indexOf(Math.min(...distances));
          el.releasePointerCapture(e.pointerId);
          el.style.scrollSnapType = "";
          center(target);
        }
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
        dragging.current = false;
        if (rail.current) rail.current.style.scrollSnapType = "";
      }}
      onClickCapture={(e) => {
        if (dragging.current) {
          e.preventDefault();
          e.stopPropagation();
          dragging.current = false;
        }
      }}
    >
      {cards.map((tea, i) => (
        <div key={tea.id} className="recommend-slot">
          <button
            style={{
              transformOrigin: i < active ? "right center" : "left center",
            }}
            className={`recommend-card ${active === i ? "is-active" : ""} ${selected === tea.id ? "is-selected" : ""} recommend-${tea.id}`}
            aria-label={`${tea.name} 우려보기`}
            aria-current={active === i ? "true" : undefined}
            onClick={() => {
              if (selected) return;
              setSelected(tea.id);
              timeout.current = setTimeout(() => onSelect(tea), 200);
            }}
          >
            <img
              className="recommend-image"
              src={tea.image}
              alt=""
              draggable={false}
            />
            <span className="recommend-shade" />
            <span className="recommend-tags">
              <span>{tea.moodKeyword}</span>
              <span>
                {tea.recommendedTemperature}℃ ‧ {tea.recommendedDuration / 60}분
              </span>
            </span>
            <span className="recommend-copy">
              <strong>{tea.recommendationTitle}</strong>
              <span>{tea.recommendationDescription}</span>
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
