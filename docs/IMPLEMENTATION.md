# T100 구현 및 검수 결과

검수일: 2026-09-27. 기준 Figma 파일: `plfiqsLv60YxHkZrLl3gTf`.

## 1. 구현 완료 요약

빈 작업공간에서 Vite + React + TypeScript 앱을 구성했습니다. 기존 `assets/vid/splash.mp4`를 보존하고 실제 영상으로 사용했습니다. 로그인·회원가입, 추천 캐러셀, 차 목록, Hot/Iced 설정, 타이머, 자동 기록, Library와 상세 시트, 재우림, My Page와 하단 설정까지 연결했습니다.

총괄 에이전트가 11개 프레임의 design context, 스크린샷, 레이어 구조, 속성 및 prototype 정보를 직접 확인했습니다. `[화면명].txt`와 `structure.json`은 `docs/figma/`에 보관했습니다. 최종 화면과 Figma의 나란한 비교는 `docs/qa/compare-*.png`에 있습니다. Splash 비교의 영상 재생 시점은 1.4초이며, Figma 정지 캡처와 영상 내용이 다른 것은 의도된 결과입니다.

React 19, React Router 7, TypeScript 5.9, Vite 7을 사용합니다. Tailwind, UI 프레임워크, 전역 상태 라이브러리, 모션 라이브러리는 추가하지 않았습니다. CSS transition과 native scroll-snap으로 필요한 동작을 구현했습니다. 처음부터 Git 저장소가 없었으므로 commit은 생성하지 않았습니다.

## 2. 생성 또는 수정한 주요 파일

| 영역             | 파일                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 진입점·라우팅    | `src/main.tsx`, `src/app/App.tsx`, `src/app/AppShell.tsx`, `src/app/router.tsx`                                               |
| 상태·저장        | `src/store/types.ts`, `src/store/appReducer.ts`, `src/store/appContext.tsx`                                                   |
| 타이머 시간 계산 | `src/hooks/useBrewTimer.ts`                                                                                                   |
| 공통 UI          | `src/components/layout/Chrome.tsx`, `src/components/ui/FormField.tsx`, `Modal.tsx`, `TasteMeter.tsx`                          |
| 화면             | `src/features/auth/Auth.tsx`, `home/Home.tsx`, `brewing/Brewing.tsx`, `library/Library.tsx`, `profile/Profile.tsx`            |
| 스타일           | `src/styles/tokens.css`, `typography.css`, `globals.css` 및 각 feature/component의 CSS                                        |
| 데이터           | `src/data/teas.ts`, `src/data/seed.ts`                                                                                        |
| 검증             | `src/store/appReducer.test.ts`, `tests/e2e/*.spec.ts`, `playwright.config.ts`, `vitest.config.ts`                             |
| 실행·빌드        | `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `index.html`, `public/_redirects` |

## 3. 전체 라우트 목록

| 경로                     | 동작                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| `/`                      | `/splash`로 이동                                                         |
| `/splash`                | 실제 영상 재생, 무세션 Login / 세션 Home, 진행 중인 타이머가 있으면 복원 |
| `/login`                 | 이메일 및 mock 소셜 로그인                                               |
| `/join`                  | 이름·이메일·비밀번호·확인·필수 동의 검증                                 |
| `/home`                  | 추천 캐러셀과 6종 차 둘러보기                                            |
| `/brew/:teaId`           | 하나의 재사용 화면으로 Hot/Iced 설정                                     |
| `/timer`                 | 경과 시간 기반 카운트다운 및 진행 배경                                   |
| `/success`               | 완료 기록 안내, 해당 차 상세로 이동                                      |
| `/library`               | 차별 집계 기록                                                           |
| `/library?tea=chamomile` | Library 위 상세 시트; 다른 차 ID도 지원                                  |
| `/profile`               | 통계, 개인 권장값, 설정, 로그아웃·탈퇴                                   |

앱 화면은 세션을 확인하고, 알 수 없는 차 ID는 Home으로, 알 수 없는 경로는 Splash로 이동합니다.

## 4. 구현한 공통 컴포넌트

`AppShell`, `DeviceStatusBar`, `AppHeader`, `HomeIndicator`, `BottomNavigation`, `Icon`, `FormField`, `TasteMeter`, `Modal`을 구현했습니다. Modal의 sheet variant가 상세 바텀시트입니다. Primary 버튼 스타일, segment, water selector, range는 재사용 CSS 및 BrewingSetup 내부의 단일 구현을 사용합니다.

최대 앱 너비는 402px이며 넓은 화면에서는 중앙 배치됩니다. `100dvh`, safe-area 변수, `viewport-fit=cover`, 고정 내비게이션 여백을 적용했습니다. 짧은 화면은 세로로 스크롤됩니다. 입력 label·오류 연결, 현재 내비게이션, 버튼의 선택 상태, dialog 이름, range 값, 키보드 포커스를 제공합니다.

## 5. 구현한 인터랙션

- Splash: autoplay/muted/playsInline/preload, ended 이동, 2.5초 fallback, timeout 정리 및 중복 이동 방지.
- Auth: Enter 제출, 이메일·비밀번호 및 가입 조건 검증, 첫 오류 포커스, mock 세션, Login/Join 200ms dissolve.
- Home: native 터치 스크롤과 scroll-snap, 마우스 drag, 화살표 이동, 중앙 카드 활성 상태, 200ms 선택 피드백 후 설정 이동. 둘러보기 6종 모두 동작.
- BrewingSetup: Hot/Iced 전환, 물 선택, 30초 단위 30~600초 native range와 키보드 조절.
- Timer: `endsAt - Date.now()`로 남은 시간 계산, visibility/pageshow 복귀 보정, interval 정리, 새로고침 복원. 시간에 따라 gradient가 올라오며 종료 시 자동 기록과 Success 이동. ID guard로 중복 저장 방지. 이탈 시 계속/취소 dialog. 지원 브라우저에서 짧은 진동.
- Library: 집계 기록과 최신 날짜, 300ms 상세 시트, backdrop/Escape/닫기 영역/아래 방향 drag, focus 복귀, 배경 스크롤 잠금, 저장한 설정으로 재우림.
- Profile: 통계 계산, 선호 차 상세 이동, 개인 권장값으로 재우림, 설정 shortcut 스크롤·포커스, 이름 편집, 기본 음용 방식 저장, 알림 선호 토글, 로그아웃, 확인 후 탈퇴·로컬 데이터 초기화.
- `prefers-reduced-motion`에서는 모션을 줄이고 기능은 유지합니다.

## 6. 상태 및 localStorage 구조

Context + Reducer를 사용하며 `t100.app.v1` 키 하나에 version 1 JSON을 저장합니다.

```ts
{
  version: 1,
  session: { name, email, provider } | null,
  selected: { teaId, drinkMode, waterSource, duration } | null,
  timer: { id, teaId, drinkMode, waterSource, duration, startedAt, endsAt } | null,
  records: [{ id, teaId, brewedAt, drinkMode, waterSource, duration, count }],
  preferences: [{ teaId, drinkMode, waterSource, duration }],
  lastRecordId: string | null,
  notifications: boolean,
  defaultDrinkMode: 'hot' | 'iced'
}
```

남은 시간·진행률·잔 수·차종 수·선호 순위는 저장 상태에서 계산합니다. 비밀번호는 저장하지 않습니다. 완료 시 기록 1건과 해당 차의 개인 권장값을 갱신합니다. 저장 실패 시 안내하며, 손상된 JSON이나 잘못된 기록·타이머는 복원하지 않습니다. storage 이벤트로 다른 탭의 상태 변경도 반영합니다.

최초 seed는 6종·63잔과 개인 권장값 3개입니다. 기존 기록은 개별 63개 세션이 아닌 차별 집계 6건이며, 이후 기록부터 한 잔 단위로 추가됩니다. Figma에서 월일만 주어져 seed 연도와 시각은 2026년 한국 정오로 정했습니다. 탈퇴 후에는 빈 상태를 저장하여 새로고침해도 seed가 재생성되지 않습니다. mock 세션 간 기록은 같은 기기의 공용 데이터입니다.

## 7. Figma 에셋 처리 결과

Figma 이미지·SVG 42개를 원본으로 내려받아 `public/assets/images`와 `public/assets/icons`에 저장했습니다. 원본 크기, crop, 위치, SVG variant를 확인했습니다. 자산별 파일 경로·크기·출처 화면은 `docs/ASSETS.json`에 있습니다. 사용 자산에 빈 파일이나 임시 Figma URL은 없습니다.

Library는 원본 gradient layer SVG 6개와 중앙 축 SVG를 조합합니다. 화면 스크린샷은 UI에 사용하지 않습니다. 아이콘은 원본 SVG이며 이모지나 외부 아이콘 세트로 대체하지 않았습니다. 흰 바탕이 포함된 로고 export 대신 원래 지정된 iceJaram 글꼴로 T100 텍스트를 렌더링합니다.

MaruBuri SemiBold, NanumSquareRound Regular/Bold, iceJaram Regular를 공식 배포처에서 확보했고 라이선스를 동봉했습니다. iceJaram은 파일 수정 제한 때문에 7.3MB 원본 TTF를 유지했습니다. 상태 표시줄은 시스템 폰트입니다. 출처와 해시는 `docs/FONTS.md`에 있습니다.

기존 Splash MP4는 1080×2352, 약 2.55초이며 실제 재생을 검증했습니다. 가짜 영상이나 유사 사진을 추가하지 않았습니다.

## 8. 테스트한 viewport

Chromium 및 WebKit에서 402×874, 375×812, 390×844, 430×932의 11개 화면을 캡처했습니다. 402×874를 Figma와 나란히 직접 검수하고 crop, 글꼴, 간격, 위치, 하단 영역을 보정했습니다. 430px에서는 402px 앱이 중앙에 배치됩니다. 추가로 375×650에서 Home의 긴 목록과 우림 설정의 세로 스크롤을 확인했습니다.

검수 이미지는 `docs/qa/{너비}x{높이}/`와 `docs/qa/{너비}x{높이}-webkit/`에 있습니다. 실제 iPhone 기기는 사용하지 않았습니다. WebKit 검증은 Safari 엔진 기반 자동화이며 실제 기기의 주소창·소프트 키보드·비영(非零) safe-area 실측을 대체하지 않습니다.

## 9. 실행한 lint/test/build 결과

- 의존성 설치와 `npm run dev`: 성공.
- `npm run lint`: 성공, 오류 없음.
- `npm run test`: reducer 및 저장 복원 관련 6개 통과.
- `npm run test:e2e`: 33개 통과, 1개 의도적 건너뜀. Chromium 전용 CDP 터치 입력 검사는 WebKit에서 제공되지 않아 skip하고 Chromium에서 통과했습니다.
- `npm run build`: TypeScript 및 Vite production build 성공. 정적 산출물은 `dist/`.
- `npm audit`: 알려진 취약점 0개.

E2E는 인증, 키보드·마우스·터치 캐러셀, Hot/Iced, range, 실제 시계 기반 timer 감소와 새로고침·장시간 경과 복원, 단일 완료 기록, 취소, 시트 focus/backdrop/Escape, 재우림, 설정, 로그아웃·탈퇴를 검사합니다. 모든 viewport에서 가로 overflow, 앱 너비, 이미지 로드, 런타임 및 console 오류도 확인했습니다. 타이머 장시간 진행은 Playwright clock으로 재현했습니다.

axe의 WCAG A/AA 검사에서 이름·폼·dialog 등 검사된 구조 규칙의 위반은 없었습니다. 색 대비 경고는 Figma 색상을 유지한 항목에 남아 있으므로 접근성 전체 통과라고 보고하지 않습니다. 안정된 화면을 검사하도록 reduced-motion을 사용했으며 원문 결과는 `docs/qa/accessibility-{chromium,webkit}.json`에 있습니다.

## 10. 다른 모델에게 위임한 작업과 총괄 검수

- `fonts` 에이전트: 공식 폰트 조사·파일 확보·라이선스 문서만 위임했습니다. 총괄이 글꼴 경로·굵기·CSS를 적용하고 브라우저 렌더링을 직접 확인했습니다.
- `tea_data` 에이전트: 제공 Figma 문구의 Tea/seed 데이터와 작은 표시용 TasteMeter만 위임했습니다. 총괄이 데이터와 원본 SVG를 대조하고, 세로 flex 배치에 맞지 않던 TasteMeter의 고정 flex-basis를 수정해 통합했습니다. 미제공 정보와 시간값 차이도 재검수했습니다.

의존성 설치·진입점·라우팅·전역 상태·토큰·레이아웃·영상·캐러셀·타이머·기록 저장·바텀시트·최종 검수는 총괄이 직접 담당했습니다. 에이전트에 전체 구조 변경이나 최종 판단을 위임하지 않았습니다.

## 11. 실제로 남아 있는 문제

- Figma의 일부 작은 보조 문구, 코랄 배지의 밝은 글씨, 코랄 통계 숫자는 WCAG AA 대비에 미달합니다. 원본 색을 크게 바꾸지 말라는 요구에 따라 보존했습니다. 파일: `src/styles/tokens.css`, `src/features/home/home.css`, `src/features/profile/profile.css`, `src/features/auth/auth.css`.
- 브랜드 텍스트용 iceJaram TTF가 7.3MB여서 첫 방문 폰트 전송 비용이 큽니다. 합법적인 경량 배포본을 확보하면 개선할 수 있습니다. 파일: `src/styles/typography.css`.
- 실제 OAuth·서버 인증·비밀번호 복구/변경·계정별 서버 저장·푸시 알림은 없습니다. 이는 요청한 클라이언트 프로토타입 범위입니다. 알림 설정은 로컬 선호값이며 OS 알림을 발송하지 않습니다.
- 상세 디자인이 없는 plus/알림/고객지원/약관 관련 항목은 가벼운 안내를 제공합니다. 문서·API·연결 화면 제공 후 확장해야 합니다. 파일: `Chrome.tsx`, `Auth.tsx`, `Profile.tsx`.
- 캐모마일 외 기록 상세에는 전용 꽃 일러스트 대신 해당 차의 제공된 원본 사진을 사용합니다. 버터플라이피·보리차는 사진이 없어 색상 표식과 차 이름을 사용하며, 미제공 상세 정보는 표시하지 않습니다. 완료 화면도 해당 차 사진 또는 차 이름을 표시합니다. 파일: `Library.tsx`, `Brewing.tsx`.
- 시스템 상태 텍스트 및 글꼴 rasterization은 Figma와 브라우저 사이에 소폭 차이가 있습니다. 물리적 iPhone 테스트와 외부 서비스 배포는 수행하지 않았습니다.

## 12. 필요한 외부 자산

제공된 11개 프레임 재현에 필요한 Splash 원본 영상과 지정 폰트는 확보했습니다. 미확보 필수 영상은 없습니다.

미제공 상태까지 완성하려면 버터플라이피·보리차 원본 이미지와 차별 상세 일러스트/완료 이미지, 누락된 차 상세값, plus 및 고객지원 등 연결 화면, 이용약관·개인정보 처리방침 원문이 필요합니다. 그 자리에 유사 stock 이미지를 임의로 사용하지 않았습니다.

## 13. Figma 디자인 확인이 필요한 불일치 사항

| 항목                  | 구현 및 확인 사항                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Choice Hot/Ice chrome | Hot에는 상태 표시줄·헤더·홈 인디케이터, Ice에는 없음. `Brewing.tsx`에서 각 Figma 상태를 보존함.                                                          |
| Library 내비게이션    | Library에서도 Coffee off / Home on / User off를 보존함. `Chrome.tsx`의 시각 variant는 원본을 따르되 `aria-current`는 실제 경로를 나타냄.                 |
| 캐모마일 시간         | Home 4분, Hot 2분 30초, Ice 3분, 저장 취향 3분 30초. 데이터와 화면의 용도별로 원본값을 보존함.                                                           |
| 캐모마일 맛 문구      | Home의 `단맛`, Detail의 `은은한 단맛`을 각각 보존함.                                                                                                     |
| 루이보스 카페인       | Figma의 `카페인 낮음` 문구를 그대로 보존함. 문구 재확인 필요.                                                                                            |
| 일부 차의 미제공 값   | 추천 3종의 일부 상세값, 버터플라이피·보리차 정보는 미제공. 임의의 사실값 대신 빈 값 사용. 미제공 iced 시간·물 종류는 편집 가능한 프로토타입 기본값 사용. |
| 텍스트 대비           | 원본 코랄/밝은 배지 글씨와 일부 보조 문구의 대비를 유지할지, 접근성용 색상 variant를 제공할지 확인 필요.                                                 |

총괄 에이전트가 통합 코드, 기능 검증 및 최종 시각 검수 결과를 확인했습니다.
