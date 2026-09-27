import { test, expect } from "@playwright/test";
test("스플래시 원본 영상 재생과 종료/timeout 이동", async ({ page }) => {
  await page.goto("/splash");
  const video = page.locator("video");
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThan(0);
  const meta = await video.evaluate((v: HTMLVideoElement) => ({
    duration: v.duration,
    width: v.videoWidth,
    height: v.videoHeight,
    muted: v.muted,
  }));
  expect(meta.muted).toBe(true);
  expect(meta.duration).toBeGreaterThan(2.4);
  expect(meta.duration).toBeLessThan(2.7);
  expect(meta.width).toBeGreaterThan(0);
  await expect(page).toHaveURL(/\/login$/, { timeout: 5000 });
  await page.getByRole("button", { name: "Apple로 계속하기" }).click();
  await page.goto("/splash");
  await expect(page).toHaveURL(/\/home$/, { timeout: 5000 });
});
test("캐러셀 마우스 drag는 선택 없이 이동하고 가운데 정렬된다", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "카카오로 계속하기" }).click();
  await expect(
    page.getByRole("button", { name: "홍차 우려보기" }),
  ).toHaveAttribute("aria-current", "true");
  await page.mouse.move(315, 470);
  await page.mouse.down();
  await page.mouse.move(70, 470, { steps: 16 });
  await page.mouse.up();
  await expect(
    page.getByRole("button", { name: "우롱차 우려보기" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(page).toHaveURL(/\/home$/);
  await expect
    .poll(async () => {
      const r = await page
        .getByRole("button", { name: "우롱차 우려보기" })
        .boundingBox();
      return Math.abs(r!.x + r!.width / 2 - 201);
    })
    .toBeLessThan(2);
});
test("네이티브 터치 swipe로 추천 이동", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "CDP 터치 입력은 Chromium에서 제공");
  await page.goto("/login");
  await page.getByRole("button", { name: "카카오로 계속하기" }).click();
  await expect(
    page.getByRole("button", { name: "홍차 우려보기" }),
  ).toHaveAttribute("aria-current", "true");
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 320, y: 470 }],
  });
  for (let x = 300; x >= 60; x -= 20)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: 470 }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(
    page.getByRole("button", { name: "우롱차 우려보기" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(page).toHaveURL(/\/home$/);
});
test("홈 전체 목록 에셋과 점수·선택, 작은 화면 스크롤", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 650 });
  await page.goto("/login");
  await page.getByRole("button", { name: "카카오로 계속하기" }).click();
  await page
    .getByRole("heading", { name: "차 둘러보기" })
    .scrollIntoViewIfNeeded();
  const cards = page.locator(".tea-card");
  await expect(cards).toHaveCount(6);
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded();
    await card
      .locator(".tea-image img")
      .evaluate((i: HTMLImageElement) => i.decode());
    expect(await card.locator(".taste-meter img").count()).toBe(15);
    expect(
      await card.evaluate((e) => e.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(375);
  }
  await cards.filter({ hasText: "캐모마일" }).click();
  await expect(page).toHaveURL(/\/brew\/chamomile$/);
  await page
    .getByRole("button", { name: "나만의 차 마셔보기" })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "나만의 차 마셔보기" }),
  ).toBeInViewport();
});
test("타이머 진행색 증가와 reduced motion 완료", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await page.getByRole("button", { name: "카카오로 계속하기" }).click();
  await page.goto("/brew/chamomile");
  await page.clock.install({ time: new Date("2030-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2030-01-01T00:00:01Z"));
  await page.getByRole("button", { name: "나만의 차 마셔보기" }).click();
  await page.clock.runFor(75000);
  expect(
    Number(await page.locator(".timer-fill").getAttribute("data-progress")),
  ).toBeGreaterThan(0.49);
  expect(
    Number(await page.locator(".timer-fill").getAttribute("data-progress")),
  ).toBeLessThan(0.52);
  await page.clock.fastForward(76000);
  await expect(page).toHaveURL(/\/success$/);
});
