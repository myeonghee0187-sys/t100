# T100 로컬 폰트

확인 및 다운로드: 2026-09-27. 네 가지 파일 모두 제작사의 공식 배포 경로에서 받았습니다. 임의의 대체 폰트를 사용하지 않았습니다. 폰트 파일의 바이트를 수정하거나 형식을 변환하지 않았습니다.

| 파일 (`public/assets/fonts/`) | 권장 CSS family | CSS weight | 크기 | 확인된 내부 이름 |
| --- | --- | --- | --- | --- |
| `MaruBuri-SemiBold.woff2` | `MaruBuri` | `600` | 466,108 bytes | MaruBuri SemiBold / MaruBuri-SemiBold |
| `NanumSquareRoundR.woff2` | `NanumSquareRound` | `400` | 247,228 bytes | NanumSquareRound Regular / NanumSquareRoundR |
| `NanumSquareRoundB.woff2` | `NanumSquareRound` | `700` | 232,072 bytes | NanumSquareRound Bold / NanumSquareRoundB |
| `iceJaram-Regular.ttf` | `iceJaram` | `400` | 7,303,456 bytes | iceJaram Regular / iceJaram-Rg |

## 적용 예시

```css
@font-face {
  font-family: 'MaruBuri';
  src: url('/assets/fonts/MaruBuri-SemiBold.woff2') format('woff2');
  font-style: normal;
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: 'NanumSquareRound';
  src: url('/assets/fonts/NanumSquareRoundR.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'NanumSquareRound';
  src: url('/assets/fonts/NanumSquareRoundB.woff2') format('woff2');
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: 'iceJaram';
  src: url('/assets/fonts/iceJaram-Regular.ttf') format('truetype');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
```

디자인의 실제 굵기를 유지하려면 해당 요소에 위 weight를 지정합니다. iceJaram은 Regular 한 종류입니다. `font-synthesis: none`을 사용하면 존재하지 않는 굵기를 브라우저가 합성하지 않습니다. 로고를 Figma SVG로 내보내어 쓰는 경우 그 SVG의 글자는 폰트 다운로드에 의존하지 않을 수 있습니다. 이 작업에서는 로고 자산을 수정하지 않았습니다.

## 공식 출처 및 이용조건

### MaruBuri, NanumSquareRound

- [네이버 공식 폰트 모음](https://hangeul.naver.com/fonts/search?f=n)
- [공식 MaruBuri 웹폰트 CSS](https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css)
- [공식 NanumSquareRound 웹폰트 CSS](https://hangeul.naver.com/hangeul_static/css/nanum-square-round.css)
- [네이버 공식 라이선스 전문](https://help.naver.com/service/11029/contents/18088?lang=ko&osType=PC)
- [현행 네이버 글꼴 이용 안내](https://hangeul.naver.com/font)

네이버 및 네이버 문화재단의 글꼴이며 SIL Open Font License 1.1을 적용합니다. 라이선스와 저작권 고지를 동봉하여 소프트웨어에 포함할 수 있습니다. 글꼴 자체의 단독 판매는 허용되지 않으며 수정본의 예약 폰트 이름 사용 등에는 OFL 조건이 적용됩니다. 원문을 `public/assets/fonts/NAVER-LICENSE.txt`에 동봉했습니다.

다운로드한 정확한 웹폰트 URL:

- [MaruBuri SemiBold WOFF2](https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.woff2)
- [NanumSquareRound Regular WOFF2](https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareRound/NanumSquareRoundR.woff2)
- [NanumSquareRound Bold WOFF2](https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareRound/NanumSquareRoundB.woff2)

### iceJaram Regular — 인천교육자람체

- [인천광역시교육청 공식 서체 및 저작권 안내](https://www.ice.go.kr/ice/cm/cntnts/cntntsView.do?cntntsId=943&mi=10874)
- [공식 인천교육자람체 ZIP](https://www.ice.go.kr/common/nttFileDownload.do?fileKey=4b1df34c903164a08402ed871148bcce)

위 ZIP의 원본 TTF를 `iceJaram-Regular.ttf`라는 경로로 저장했습니다. 내부 영문 이름은 `iceJaram Regular`, PostScript 이름은 `iceJaram-Rg`, weight는 400입니다. 이는 Figma의 iceJaram Regular와 대응하는 폰트입니다.

공식 안내는 웹·모바일·CI/BI·판매용 저작물에서 별도 허가 절차 없이 사용 가능하다고 명시하고, 출처 표기를 권장하며 글꼴의 유료 양도·판매를 금지합니다. 폰트 자체의 메타데이터는 파일 수정 시 인천광역시교육청의 사전 서면 허가가 필요하다고 명시합니다. 따라서 원본 TTF를 보존했고, WOFF2 변환 또는 서브셋화하지 않았습니다. 공식 고지와 메타데이터 저작권 문구는 `public/assets/fonts/INCHEON-LICENSE.txt`에 동봉했습니다.

이 폰트는 OFL로 표기하지 않습니다. 크기가 약 7 MB이므로 실제 사용되는 요소가 있을 때만 로드하도록 하는 편이 적절합니다.

## 검증

- 네이버 파일: WOFF2 헤더와 Node.js 내장 Brotli 압축 해제로 `name`, `OS/2`, `maxp` 테이블을 직접 읽었습니다. family/PostScript 이름 및 weight가 요청과 일치합니다.
- MaruBuri 공식 WOFF2: 내부 버전 1.000, 12,466 glyphs. 네이버 현재 웹폰트 CSS가 가리키는 원본입니다. 별도로 확인한 공식 ZIP의 TTF는 내부 버전 2.000이며 이 프로젝트에는 ZIP TTF 대신 공식 웹폰트를 포함했습니다.
- NanumSquareRound Regular/Bold: 내부 버전 1.000, 각각 15,545 glyphs.
- iceJaram: 원본 TTF의 `name` 및 `OS/2` 테이블에서 family와 weight를 확인했습니다.
- 앱 CSS 적용 및 브라우저 렌더링은 통합 작업에서 검증합니다.

## SHA-256

- `MaruBuri-SemiBold.woff2`: `7aef4862fa3219b0a7deb6746e27116a38c4069f4424eb51edf103b29795f5c2`
- `NanumSquareRoundR.woff2`: `3127eb6b4cf10a0a840d204d613f610bbbd7f8a7ce82c0f81d04713760f81758`
- `NanumSquareRoundB.woff2`: `4e8692a08d6c323f1bffb3641c7276d9c4bc8fa2891d78b02acc972776228600`
- `iceJaram-Regular.ttf`: `c5c3c96bd22205f42353caf63976024237282da009b7a80fa025f7fc2d5a6219`
