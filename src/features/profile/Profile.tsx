import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BottomNavigation,
  DeviceStatusBar,
  Icon,
} from "../../components/layout/Chrome";
import { FormField } from "../../components/ui/FormField";
import { Modal } from "../../components/ui/Modal";
import { getTea } from "../../data/teas";
import { useApp } from "../../store/appContext";
import { modeLabels, waterLabels } from "../../store/types";
import { aggregateRecords } from "../library/Library";
import { formatDuration } from "../brewing/Brewing";
import "./profile.css";
export function Profile() {
  const { state, dispatch, notify } = useApp();
  const navigate = useNavigate();
  const settings = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<"delete" | "edit" | null>(null);
  const [name, setName] = useState(state.session?.name ?? "지훈");
  const groups = aggregateRecords(state.records);
  const total = groups.reduce((s, r) => s + r.count, 0);
  const favorites = [...groups].sort((a, b) => b.count - a.count).slice(0, 3);
  const unavailable = (label: string) =>
    notify(`${label}은 정식 서비스에서 제공될 예정이에요.`);
  function rebrew(teaId: string) {
    const pref = state.preferences.find((p) => p.teaId === teaId);
    if (pref) dispatch({ type: "SELECT", settings: pref });
    navigate(`/brew/${teaId}`);
  }
  function settingAction(label: string) {
    switch (label) {
      case "계정 정보":
        notify(`${state.session?.name} · ${state.session?.email}`);
        break;
      case "알림 설정":
        dispatch({ type: "NOTIFICATIONS", enabled: !state.notifications });
        notify(state.notifications ? "알림을 껐어요." : "알림을 켰어요.");
        break;
      case "자동 기록":
        notify("차를 다 우리면 자동으로 기록돼요.");
        break;
      case "기본 음용 방식":
        dispatch({
          type: "DEFAULT_MODE",
          mode: state.defaultDrinkMode === "hot" ? "iced" : "hot",
        });
        break;
      case "기록 관리":
        navigate("/library");
        break;
      default:
        unavailable(label);
    }
  }
  const menus = [
    { title: "계정", rows: ["계정 정보", "비밀번호 변경"] },
    {
      title: "앱 설정",
      rows: ["알림 설정", "자동 기록", "기본 음용 방식", "기록 관리"],
    },
    { title: "고객지원", rows: ["공지사항", "자주 묻는 질문", "문의하기"] },
    {
      title: "서비스 정보",
      rows: ["이용약관", "개인정보 처리방침", "앱 버전"],
    },
  ];
  return (
    <main className="page profile-page">
      <div className="status-only">
        <DeviceStatusBar />
      </div>
      <div className="profile-content">
        <div className="profile-heading">
          <h1>마이페이지</h1>
          <button
            className="settings-shortcut"
            onClick={() => {
              settings.current?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
                block: "start",
              });
              settings.current?.focus({ preventScroll: true });
            }}
          >
            <Icon name="settings" />
            설정
          </button>
        </div>
        <section className="profile-card">
          <div className="profile-avatar">
            <Icon name="coffee-on" />
          </div>
          <button
            className="profile-edit"
            onClick={() => {
              setName(state.session?.name ?? "지훈");
              setModal("edit");
            }}
          >
            프로필 수정
          </button>
          <div className="profile-greeting">
            <h2>{state.session?.name ?? "지훈"}님</h2>
            <p>한 잔씩, 나만의 취향이 쌓여요.</p>
          </div>
          <div className="profile-stats">
            {[
              { label: "우림 횟수", value: total, unit: "잔" },
              { label: "즐긴 차", value: groups.length, unit: "종" },
              {
                label: "내 권장값",
                value: state.preferences.length,
                unit: "개",
              },
            ].map((m, i) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <p>
                  <strong className={i === 0 ? "coral" : ""}>{m.value}</strong>
                  {m.unit}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="favorites">
          <h2>선호 차종</h2>
          <div className="favorite-list">
            {favorites.map((g) => (
              <button
                key={g.teaId}
                onClick={() => navigate(`/library?tea=${g.teaId}`)}
              >
                <span>
                  <i style={{ background: getTea(g.teaId)?.color }} />
                  {getTea(g.teaId)?.name}
                </span>
                <small>{g.count}잔</small>
              </button>
            ))}
            {!favorites.length && <p>차를 우리며 취향을 쌓아보세요.</p>}
          </div>
        </section>
        <section className="preferences-card">
          <div className="preferences-heading">
            <h2>개인 권장값</h2>
            <span>{state.preferences.length}개 저장</span>
          </div>
          <p>내 입맛에 맞춰 저장한 우림 설정</p>
          <div className="preference-list">
            {state.preferences.map((pref) => (
              <button key={pref.teaId} onClick={() => rebrew(pref.teaId)}>
                <i style={{ background: getTea(pref.teaId)?.color }} />
                <span>
                  <strong>{getTea(pref.teaId)?.name}</strong>
                  <small>
                    {waterLabels[pref.waterSource]} ·{" "}
                    {formatDuration(pref.duration)}
                  </small>
                </span>
                <em className={pref.drinkMode}>{modeLabels[pref.drinkMode]}</em>
              </button>
            ))}
          </div>
        </section>
        <section
          className="profile-settings"
          ref={settings}
          tabIndex={-1}
          aria-label="설정"
        >
          {menus.map((menu) => (
            <section className="settings-group" key={menu.title}>
              <h2>{menu.title}</h2>
              <div>
                {menu.rows.map((label) =>
                  label === "앱 버전" ? (
                    <div key={label} className="settings-row">
                      <span>{label}</span>
                      <small>1.0.0</small>
                    </div>
                  ) : (
                    <button
                      className="settings-row"
                      key={label}
                      onClick={() => settingAction(label)}
                      aria-pressed={
                        label === "알림 설정" ? state.notifications : undefined
                      }
                    >
                      <span>{label}</span>
                      {label === "자동 기록" && <small>사용 중</small>}
                      {label === "기본 음용 방식" && (
                        <small>{modeLabels[state.defaultDrinkMode]}</small>
                      )}
                      <Icon name="chevron-right" />
                    </button>
                  ),
                )}
              </div>
            </section>
          ))}
          <div className="account-actions">
            <div>
              <button
                onClick={() => {
                  dispatch({ type: "LOGOUT" });
                  navigate("/login", { replace: true });
                }}
              >
                로그아웃
              </button>
              <i />
              <button onClick={() => setModal("delete")}>회원 탈퇴</button>
            </div>
            <p>T100 · Tea for Travel</p>
          </div>
        </section>
      </div>
      <BottomNavigation />
      {modal === "delete" && (
        <Modal title="회원 탈퇴" onClose={() => setModal(null)}>
          <h2>회원 탈퇴</h2>
          <p>
            이 기기에 저장된 프로필, 차 기록과 개인 권장값을 모두 삭제할까요?
          </p>
          <div className="modal-actions">
            <button onClick={() => setModal(null)}>취소</button>
            <button
              className="primary-button"
              onClick={() => {
                dispatch({ type: "DELETE_ACCOUNT" });
                navigate("/login", { replace: true });
              }}
            >
              탈퇴하기
            </button>
          </div>
        </Modal>
      )}
      {modal === "edit" && (
        <Modal title="프로필 수정" onClose={() => setModal(null)}>
          <h2>프로필 수정</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) {
                dispatch({ type: "UPDATE_NAME", name: name.trim() });
                setModal(null);
              }
            }}
          >
            <FormField
              id="profile-name"
              label="이름"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <div className="modal-actions profile-edit-actions">
              <button type="button" onClick={() => setModal(null)}>
                취소
              </button>
              <button className="primary-button" disabled={!name.trim()}>
                저장
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}
