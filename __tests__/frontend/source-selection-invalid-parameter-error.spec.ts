import { expect, test } from "playwright-test-coverage";

import { setup } from "../test-utils/stub-endpoints";

test("handles invalid parameter errors in source folder selection gracefully", async ({
  page,
}) => {
  await page.goto("/");
  await setup(page);

  await page.evaluate(() => {
    window._endpointStubs["listSharedDrives"] = [
      {
        status: "success",
        value: { status: "error", type: "invalidParameter" },
      },
    ];
  });

  await expect(
    page.getByText("Shared drive mover", { exact: true }),
  ).toBeVisible();
  await page.getByText("Continue").click();
  await expect(
    page.getByText("An error occurred", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Invalid parameter types")).toBeVisible();
});
