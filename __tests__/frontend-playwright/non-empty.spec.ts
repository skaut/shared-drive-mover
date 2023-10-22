import { expect, test } from "@playwright/test";

import { setup } from "../test-utils-playwright/stub-endpoints";

test("works with non-empty destination folder", async ({ page }) => {
  await page.goto("/");
  const getCalls = await setup(page);

  await page.evaluate(() => {
    window._endpointStubs.listSharedDrives = [
      {
        status: "success",
        value: { status: "success", response: [] },
      },
      {
        status: "success",
        value: { status: "success", response: [] },
      },
      {
        status: "success",
        value: { status: "success", response: [] },
      },
    ];
    window._endpointStubs.move = [
      {
        status: "success",
        delay: 500,
        value: { status: "error", type: "notEmpty" },
      },
      {
        status: "success",
        delay: 500,
        value: { status: "error", type: "notEmpty" },
      },
      {
        status: "success",
        value: { status: "success", response: { errors: [] } },
      },
    ];
  });

  await expect(
    page.getByText("Shared drive mover", { exact: true }),
  ).toBeVisible();
  await page.getByText("Continue").click();
  await page.getByText("My Drive").click();
  await page.getByText("Continue").click();
  await page.getByText("My Drive").click();
  await page.getByText("Continue").click();
  await expect(
    page.getByText(
      'contents of the folder "My Drive" into the folder "My Drive"',
    ),
  ).toBeVisible();
  await page.getByText("Move", { exact: true }).click();
  await expect(
    page.getByText("Destination not empty", { exact: true }),
  ).toBeVisible();
  await page.getByText("No", { exact: true }).click();
  await page.getByText("Continue").click();
  await page.getByText("Move", { exact: true }).click();
  await expect(
    page.getByText("Destination not empty", { exact: true }),
  ).toBeVisible();
  await page.getByText("Yes").click();
  await expect(page.getByText("Done!", { exact: true })).toBeVisible();
  await expect(page.getByText("Successfully moved")).toBeVisible();

  const moveCalls = getCalls("move");
  expect(moveCalls).toHaveLength(3);
  expect(moveCalls[0]).toStrictEqual(["root", "root", true, true, false]);
  expect(moveCalls[1]).toStrictEqual(["root", "root", true, true, false]);
  expect(moveCalls[2]).toStrictEqual(["root", "root", true, true, true]);
});
