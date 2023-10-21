import { expect, test } from "@playwright/test";

import { calls, setup } from "../test-utils-playwright/stub-endpoints";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await setup(page);

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
    ];
    window._endpointStubs.move = [
      {
        status: "success",
        value: { status: "success", response: { errors: [] } },
      },
    ];
  });
});

test("works with basic configuration", async ({ page }) => {
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
  await expect(page.getByText("Done!", { exact: true })).toBeVisible();
  await expect(page.getByText("Successfully moved")).toBeVisible();

  expect(calls.move).toHaveLength(1);
  expect(calls.move[0]).toStrictEqual(["root", "root", true, true, false]);
});
