import { expect, test } from "playwright-test-coverage";

import { setup } from "../test-utils/stub-endpoints";

test("works with basic configuration", async ({ page }) => {
  await page.goto("/");
  const getCalls = await setup(page);

  await page.evaluate(() => {
    window._endpointStubs["listSharedDrives"] = [
      {
        status: "success",
        value: { response: [], status: "success" },
      },
      {
        status: "success",
        value: { response: [], status: "success" },
      },
    ];
    window._endpointStubs["move"] = [
      {
        status: "success",
        value: { response: { errors: [] }, status: "success" },
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
  await expect(page.getByText("Done!", { exact: true })).toBeVisible();
  await expect(page.getByText("Successfully moved")).toBeVisible();

  const moveCalls = getCalls("move");
  expect(moveCalls).toHaveLength(1);
  expect(moveCalls[0]).toStrictEqual(["root", "root", true, true, false]);
});
