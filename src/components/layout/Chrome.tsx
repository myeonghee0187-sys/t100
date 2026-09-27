import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../store/appContext";
import "./chrome.css";
export function Icon({ name }: { name: string }) {
  return <img src={`/assets/icons/${name}.svg`} alt="" draggable={false} />;
}
export function DeviceStatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <i />
      <div>
        <Icon name="status-levels" />
      </div>
    </div>
  );
}
export function HomeIndicator() {
  return (
    <div className="home-indicator" aria-hidden="true">
      <Icon name="home-indicator" />
    </div>
  );
}
export function AppHeader({
  library = false,
  transparent = false,
  onBack,
}: {
  library?: boolean;
  transparent?: boolean;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  const { notify } = useApp();
  return (
    <header className={`app-header ${transparent ? "transparent" : ""}`}>
      <DeviceStatusBar />
      <div className="header-row">
        <button
          className="icon-button"
          aria-label="뒤로가기"
          onClick={
            onBack ??
            (() =>
              window.history.state?.idx > 0 ? navigate(-1) : navigate("/home"))
          }
        >
          <Icon name="back" />
        </button>
        <Link to="/home" aria-label="T100 홈" className="brand-link">
          <span className="brand-word">T100</span>
        </Link>
        <button
          className="icon-button"
          aria-label={library ? "기록 추가" : "알림"}
          onClick={() =>
            notify(
              library
                ? "차를 우린 뒤 나의 기록을 남길 수 있어요."
                : "새로운 알림이 없어요.",
            )
          }
        >
          <Icon name={library ? "plus" : "bell"} />
        </button>
      </div>
    </header>
  );
}
export function BottomNavigation() {
  const { pathname } = useLocation();
  const profile = pathname === "/profile";
  return (
    <div className="bottom-wrap">
      <nav className="bottom-nav" aria-label="주요 메뉴">
        {[
          { to: "/library", label: "라이브러리", icon: "coffee-off" },
          { to: "/home", label: "홈", icon: profile ? "home-off" : "home-on" },
          {
            to: "/profile",
            label: "마이페이지",
            icon: profile ? "user-on" : "user-off",
          },
        ].map((x) => (
          <Link
            key={x.to}
            to={x.to}
            aria-label={x.label}
            aria-current={pathname === x.to ? "page" : undefined}
          >
            <Icon name={x.icon} />
          </Link>
        ))}
      </nav>
      <HomeIndicator />
    </div>
  );
}
