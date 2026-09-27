# T100

Figma의 11개 화면을 구현한 React + TypeScript 모바일 티 브루잉 웹 앱입니다. 차 선택, 우림 설정, 실제 타이머, 자동 기록, 기록 상세와 재우림이 연결됩니다.

## 실행

Node.js 22.12 이상을 권장합니다.

```sh
npm ci
npm run dev
```

개발 주소: http://localhost:5173

처음에는 원본 스플래시 영상이 재생되고 로그인 화면으로 이동합니다. 소셜 로그인 버튼은 외부 서비스 연결 없이 체험용 세션을 만듭니다. 이메일 로그인은 이메일 형식과 비밀번호 입력을 검사하는 클라이언트 프로토타입입니다. 비밀번호는 저장하지 않습니다.

처음 실행하면 Figma의 6종·63잔 기록과 개인 권장값 3개가 표시됩니다. 새로 우린 기록은 이 기기의 localStorage에 저장됩니다. 회원 탈퇴는 확인 후 해당 앱의 로컬 데이터를 초기화합니다. 실제 계정별 데이터베이스는 없습니다.

## 검증 및 배포 파일

```sh
npm run lint
npm run test
npx playwright install chromium webkit
npm run test:e2e
npm run build
npm run preview
```

`dist/`가 정적 배포 산출물입니다. 하위 경로 새로고침을 위해 호스팅에서 모든 앱 경로를 `index.html`로 연결해야 합니다. `_redirects` 형식을 지원하는 호스팅용 규칙은 포함했습니다. 서비스는 루트 경로(`/`) 배포 기준입니다.

## 구현 기록

- [요청한 13개 항목의 구현·검수 보고](docs/IMPLEMENTATION.md)
- [Figma 자산 목록](docs/ASSETS.json)
- [공식 폰트 출처와 라이선스](docs/FONTS.md)
- [402×874 Figma/React 비교 이미지](docs/qa/compare-home.png)
- [브라우저 접근성 검사 원본](docs/qa/accessibility-chromium.json)

`src/app`은 라우팅과 앱 틀, `src/store`는 상태·저장, `src/features`는 화면별 구현, `src/styles`는 공통 토큰과 스타일입니다. 화면 캡처는 검수 자료로만 보관하며 앱 UI에는 사용하지 않습니다.
