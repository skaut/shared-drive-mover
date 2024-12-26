import { expect, test } from "playwright-test-coverage";

import { setup } from "../test-utils/stub-endpoints";

test("handles raw errors in source folder selection gracefully", async ({
  page,
}) => {
  await page.goto("/");
  await setup(page);

  await page.evaluate(() => {
    window._endpointStubs["listSharedDrives"] = [
      {
        status: "failure",
        value: new Error("ERROR MESSAGE"),
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
  await expect(page.getByText("ERROR MESSAGE")).toBeVisible();
});
