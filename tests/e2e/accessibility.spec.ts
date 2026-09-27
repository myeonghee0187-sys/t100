import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";
test("접근성 구조·이름·폼·dialog 검사와 디자인 대비 기록", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  const reports = [];
  for (const path of [
    "/login",
    "/join",
    "/home",
    "/brew/chamomile",
    "/library",
    "/library?tea=chamomile",
    "/profile",
  ]) {
    if (path === "/home") {
      await page.goto("/login");
      await page.getByRole("button", { name: "카카오로 계속하기" }).click();
    }
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    reports.push({
      path,
      violations: result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
  }
  const reportPath = testInfo.outputPath("accessibility.json");
  await writeFile(reportPath, JSON.stringify(reports, null, 2));
  await testInfo.attach("accessibility.json", {
    path: reportPath,
    contentType: "application/json",
  });
  expect(
    reports.flatMap((r) =>
      r.violations
        .filter((v) => v.id !== "color-contrast")
        .map((v) => ({ path: r.path, ...v })),
    ),
  ).toEqual([]);
});
