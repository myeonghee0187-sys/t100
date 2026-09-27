import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
async function login(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "카카오로 계속하기" }).click();
  await expect(page).toHaveURL(/\/home$/);
}
async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((i) => i.loading !== "lazy")
        .map((i) => i.decode().catch(() => {})),
    );
  });
}
test("로그인 입력 오류와 Enter 제출, 세션 복원", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(
    page.getByText("올바른 이메일 주소를 입력해 주세요."),
  ).toBeVisible();
  await expect(
    page.getByText("비밀번호를 입력해 주세요.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("이메일", { exact: true }).fill("tea@example.com");
  await page.getByLabel("비밀번호", { exact: true }).fill("tea12345");
  await page.getByLabel("비밀번호", { exact: true }).press("Enter");
  await expect(page).toHaveURL(/\/home$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "오늘의 차", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("t100.app.v1")),
  ).not.toContain("tea12345");
});
test("회원가입 검증과 약관, 이름 저장", async ({ page }) => {
  await page.goto("/join");
  await page.getByRole("button", { name: "가입하고 차 만나기" }).click();
  await expect(page.getByText("이름을 입력해 주세요.")).toBeVisible();
  await page.getByLabel("이름", { exact: true }).fill("차친구");
  await page.getByLabel("이메일", { exact: true }).fill("new@example.com");
  await page.getByLabel("비밀번호", { exact: true }).fill("abcdefgh");
  await page.getByLabel("비밀번호 확인", { exact: true }).fill("no-match");
  await page.getByRole("button", { name: "가입하고 차 만나기" }).click();
  await expect(
    page.getByText("영문·숫자를 포함해 8자 이상 입력해 주세요."),
  ).toBeVisible();
  await expect(page.getByText("비밀번호가 일치하지 않아요.")).toBeVisible();
  await page.getByLabel("비밀번호", { exact: true }).fill("abcd1234");
  await page.getByLabel("비밀번호 확인", { exact: true }).fill("abcd1234");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "가입하고 차 만나기" }).click();
  await page.getByRole("link", { name: "마이페이지", exact: true }).click();
  await expect(page.getByRole("heading", { name: "차친구님" })).toBeVisible();
});
test("추천 카드 키보드 이동, 카드 선택, 모드와 시간 설정", async ({ page }) => {
  await login(page);
  const carousel = page.getByRole("region", { name: "오늘의 차 추천" });
  await carousel.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("button", { name: "녹차 우려보기" }),
  ).toHaveAttribute("aria-current", "true");
  await page.getByRole("button", { name: "녹차 우려보기" }).click();
  await expect(page).toHaveURL(/\/brew\/green-tea$/);
  await page.getByRole("button", { name: "시원하게", exact: true }).click();
  await expect(page.getByText("우린 뒤 얼음에 바로 부어주세요")).toBeVisible();
  await expect(page.locator(".app-header")).toHaveCount(0);
  await page.getByRole("slider").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("slider")).toHaveValue("210");
  await page.getByRole("button", { name: "따뜻하게", exact: true }).click();
  await page.getByRole("button", { name: "끓인 물", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "끓인 물", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("타이머 감소·새로고침 복원·백그라운드 보정·완료 단일 저장·재우림", async ({
  page,
}) => {
  await login(page);
  await page.goto("/brew/chamomile");
  await page.getByRole("button", { name: "시원하게", exact: true }).click();
  await page.clock.install();
  await page.getByRole("button", { name: "나만의 차 마셔보기" }).click();
  const before = await page.evaluate(
    () => JSON.parse(localStorage.getItem("t100.app.v1")!).timer,
  );
  await expect(page.getByRole("timer")).toContainText("3 : 00");
  await page.clock.runFor(2100);
  await expect(page.getByRole("timer")).toContainText("2 : 58");
  await page.reload();
  await expect(page.getByRole("timer")).toContainText("2 : 58");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("t100.app.v1")!).timer.endsAt,
    ),
  ).toBe(before.endsAt);
  await page.clock.fastForward(178000);
  await expect(page).toHaveURL(/\/success$/);
  let records = await page.evaluate(
    () => JSON.parse(localStorage.getItem("t100.app.v1")!).records,
  );
  expect(
    records.filter((r: { id: string }) => r.id === before.id),
  ).toHaveLength(1);
  await page.reload();
  records = await page.evaluate(
    () => JSON.parse(localStorage.getItem("t100.app.v1")!).records,
  );
  expect(
    records.filter((r: { id: string }) => r.id === before.id),
  ).toHaveLength(1);
  await page.getByRole("button", { name: "기록 보기" }).click();
  await expect(page.getByRole("dialog")).toContainText("18잔의 캐모마일");
  await page.getByRole("button", { name: "다시 우리기" }).click();
  await expect(
    page.getByRole("button", { name: "시원하게", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("slider")).toHaveValue("180");
});
test("타이머 뒤로가기 계속/취소와 기록 없음", async ({ page }) => {
  await login(page);
  await page.goto("/brew/chamomile");
  await page.getByRole("button", { name: "나만의 차 마셔보기" }).click();
  await page.getByRole("button", { name: "뒤로가기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "계속 우리기" }).click();
  await expect(page).toHaveURL(/\/timer$/);
  await page.getByRole("link", { name: "홈", exact: true }).click();
  await page.getByRole("button", { name: "우림 취소", exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("t100.app.v1")!).records.length,
    ),
  ).toBe(6);
});
test("기록 시트 Escape·포커스 복귀·backdrop·재우림", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: "라이브러리", exact: true }).click();
  const card = page.getByRole("button", { name: "캐모마일 17잔" });
  await card.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(card).toBeFocused();
  await card.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.mouse.click(20, 300);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await card.click();
  await page.getByRole("button", { name: "다시 우리기" }).click();
  await expect(page.getByRole("slider")).toHaveValue("210");
});
test("마이페이지 설정 스크롤·기본 음용·로그아웃·회원 탈퇴", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("link", { name: "마이페이지", exact: true }).click();
  await page.getByRole("button", { name: "설정", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "설정", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("button", { name: "계정 정보", exact: true }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "기본 음용 방식 따뜻하게" }).click();
  await expect(
    page.getByRole("button", { name: "기본 음용 방식 시원하게" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Google로 계속하기" }).click();
  await page.getByRole("link", { name: "마이페이지", exact: true }).click();
  await page.getByRole("button", { name: "회원 탈퇴", exact: true }).click();
  await page.getByRole("button", { name: "취소", exact: true }).click();
  await page.getByRole("button", { name: "회원 탈퇴", exact: true }).click();
  await page.getByRole("button", { name: "탈퇴하기" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.reload();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("t100.app.v1")!),
  );
  expect(stored.records).toHaveLength(0);
  expect(stored.session).toBeNull();
});
for (const viewport of [
  { width: 402, height: 874 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
])
  test(`화면 ${viewport.width}×${viewport.height}: 전체 route, 이미지, 가로 overflow`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await login(page);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (e) => {
      if (e.type() === "error") errors.push(e.text());
    });
    for (const [name, path] of [
      ["login", "/login"],
      ["join", "/join"],
      ["home", "/home"],
      ["hot", "/brew/chamomile"],
      ["success", "/success"],
      ["library", "/library"],
      ["detail", "/library?tea=chamomile"],
      ["profile", "/profile"],
    ]) {
      await page.goto(path);
      await ready(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page
          .locator(".app-shell")
          .evaluate((e) => e.getBoundingClientRect().width),
      ).toBe(Math.min(viewport.width, 402));
      expect(
        await page.evaluate(() =>
          Array.from(document.images)
            .filter(
              (i) => i.loading !== "lazy" && (!i.complete || !i.naturalWidth),
            )
            .map((i) => i.src),
        ),
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${viewport.width}.png`),
      });
      if (name === "hot") {
        await page
          .getByRole("button", { name: "시원하게", exact: true })
          .click();
        await page.screenshot({
          path: testInfo.outputPath(`iced-${viewport.width}.png`),
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
    await page.goto("/brew/chamomile");
    await page.getByRole("button", { name: "시원하게", exact: true }).click();
    await page.clock.install({ time: new Date("2030-01-01T00:00:00Z") });
    await page.clock.pauseAt(new Date("2030-01-01T00:00:01Z"));
    await page.getByRole("button", { name: "나만의 차 마셔보기" }).click();
    await ready(page);
    await expect(page.getByRole("timer")).toContainText("3 : 00");
    await page.screenshot({
      path: testInfo.outputPath(`timer-${viewport.width}.png`),
    });
    await page.goto("/splash");
    await page.locator("video").evaluate(async (v: HTMLVideoElement) => {
      v.pause();
      await new Promise<void>((resolve) => {
        v.addEventListener("seeked", () => resolve(), { once: true });
        v.currentTime = 1.4;
      });
    });
    await ready(page);
    await expect(
      page.locator(".splash-screen .home-indicator"),
    ).toBeInViewport();
    await page.screenshot({
      path: testInfo.outputPath(`splash-${viewport.width}.png`),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
