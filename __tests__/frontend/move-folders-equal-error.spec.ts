import { expect, test } from "playwright-test-coverage";

import { setup } from "../test-utils/stub-endpoints";

test("works with source and destination folders being equal", async ({
  page,
}) => {
  await page.goto("/");
  await setup(page);

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
        value: { status: "error", type: "sourceEqualsDestination" },
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
  await expect(page.getByText("Confirmation")).toBeVisible();
  await expect(page.getByText("An error occurred")).toBeVisible();
  await expect(
    page.getByText("The source and destination folders must be different"),
  ).toBeVisible();
});
