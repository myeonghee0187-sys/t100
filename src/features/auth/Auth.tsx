import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DeviceStatusBar,
  HomeIndicator,
  Icon,
} from "../../components/layout/Chrome";
import { FormField } from "../../components/ui/FormField";
import { useApp } from "../../store/appContext";
import splashVideo from "../../../assets/vid/splash.mp4";
import "./auth.css";
export function Splash() {
  const { state } = useApp();
  const navigate = useNavigate();
  const done = useRef(false);
  const next = state.session ? (state.timer ? "/timer" : "/home") : "/login";
  useEffect(() => {
    done.current = false;
    const id = setTimeout(() => {
      if (!done.current) {
        done.current = true;
        navigate(next, { replace: true });
      }
    }, 2500);
    return () => clearTimeout(id);
  }, [navigate, next]);
  return (
    <main className="splash-screen">
      <DeviceStatusBar />
      <video
        aria-label="T100 스플래시"
        src={splashVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => {
          if (!done.current) {
            done.current = true;
            navigate(next, { replace: true });
          }
        }}
      />
      <HomeIndicator />
    </main>
  );
}
const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export function Auth({ join = false }: { join?: boolean }) {
  const { dispatch, notify } = useApp();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const form = useRef<HTMLFormElement>(null);
  function login(name: string, email: string, provider = "email") {
    dispatch({ type: "LOGIN", session: { name, email, provider } });
    navigate("/home", { replace: true });
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get("email") ?? "").trim();
    const password = String(d.get("password") ?? "");
    const name = String(d.get("name") ?? "").trim();
    const err: Record<string, string> = {};
    if (!validEmail(email)) err.email = "올바른 이메일 주소를 입력해 주세요.";
    if (!password) err.password = "비밀번호를 입력해 주세요.";
    if (join) {
      if (!name) err.name = "이름을 입력해 주세요.";
      if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password))
        err.password = "영문·숫자를 포함해 8자 이상 입력해 주세요.";
      if (password !== d.get("confirm"))
        err.confirm = "비밀번호가 일치하지 않아요.";
      if (!d.get("agreement")) err.agreement = "필수 약관에 동의해 주세요.";
    }
    setErrors(err);
    if (Object.keys(err).length) {
      const input = form.current?.elements.namedItem(Object.keys(err)[0]);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    login(join ? name : "지훈", email);
  }
  return (
    <main
      className={`auth-screen ${join ? "join-screen" : "login-screen"} fade-in`}
    >
      <DeviceStatusBar />
      <div className="auth-content">
        <div className="auth-intro">
          {join ? (
            <>
              <h1>차와 친해지는 첫걸음</h1>
              <p>한 잔씩, 나만의 취향을 기록해 보세요.</p>
            </>
          ) : (
            <>
              <h1 className="auth-logo">
                <span className="auth-brand-word">T100</span>
              </h1>
              <p>나의 차 시간을 이어가세요.</p>
            </>
          )}
        </div>
        <form ref={form} noValidate onSubmit={submit} className="auth-form">
          {join && (
            <FormField
              id="name"
              name="name"
              label="이름"
              placeholder="박지훈"
              autoComplete="name"
              error={errors.name}
            />
          )}
          <FormField
            id="email"
            name="email"
            label="이메일"
            type="email"
            inputMode="email"
            placeholder="example@email.com"
            autoComplete="email"
            error={errors.email}
          />
          <FormField
            id="password"
            name="password"
            label="비밀번호"
            type="password"
            placeholder={
              join ? "영문·숫자 포함 8자 이상" : "비밀번호를 입력해 주세요"
            }
            autoComplete={join ? "new-password" : "current-password"}
            error={errors.password}
            aside={
              !join && (
                <button
                  type="button"
                  className="text-link forgot"
                  onClick={() =>
                    notify("비밀번호 찾기는 정식 서비스에서 제공될 예정이에요.")
                  }
                >
                  비밀번호 찾기
                </button>
              )
            }
          />
          {join && (
            <>
              <FormField
                id="confirm"
                name="confirm"
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호를 한 번 더 입력해 주세요"
                autoComplete="new-password"
                error={errors.confirm}
              />
              <div className="agreement-wrap">
                <label className="agreement">
                  <input
                    name="agreement"
                    type="checkbox"
                    aria-invalid={!!errors.agreement}
                    aria-describedby={
                      errors.agreement ? "agreement-error" : undefined
                    }
                  />
                  <span>
                    [필수] 서비스&nbsp; <u>이용약관</u> 및{" "}
                    <u>개인정보 처리방침</u>에<br />
                    동의합니다.
                  </span>
                </label>
                {errors.agreement && (
                  <p className="error-message" id="agreement-error">
                    {errors.agreement}
                  </p>
                )}
              </div>
            </>
          )}
          <button className="primary-button" type="submit">
            {join ? "가입하고 차 만나기" : "로그인"}
          </button>
        </form>
        {!join && (
          <section className="social-login" aria-label="간편 로그인">
            <div className="auth-divider">또는 간편하게 시작하기</div>
            <div className="social-buttons">
              {[
                { id: "kakao", label: "카카오로 계속하기" },
                { id: "google", label: "Google로 계속하기" },
                { id: "apple", label: "Apple로 계속하기" },
              ].map((p) => (
                <button
                  key={p.id}
                  className={`social-button ${p.id}`}
                  onClick={() => login("지훈", `${p.id}@example.com`, p.id)}
                >
                  <span>
                    <Icon name={p.id} />
                  </span>
                  {p.label}
                </button>
              ))}
            </div>
          </section>
        )}
        <div className="account-switch">
          <span>
            {join ? "이미 계정이 있으신가요?" : "T100이 처음이신가요?"}
          </span>
          <Link className="text-link" to={join ? "/login" : "/join"}>
            {join ? "로그인" : "회원가입"}
          </Link>
        </div>
      </div>
      <div className="solo-indicator">
        <HomeIndicator />
      </div>
    </main>
  );
}
