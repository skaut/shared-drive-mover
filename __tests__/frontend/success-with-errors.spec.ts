import { expect, test } from "@playwright/test";

import { setup } from "../test-utils-playwright/stub-endpoints";

test("works and displays moving errors", async ({ page }) => {
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
    ];
    window._endpointStubs.move = [
      {
        status: "success",
        value: {
          status: "success",
          response: {
            errors: [
              { file: ["PATH", "TO", "FILE"], error: "ERROR MESSAGE 1" },
              {
                file: ["PATH", "TO", "SECOND", "FILE"],
                error: "ERROR MESSAGE 2",
              },
            ],
          },
        },
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
  await expect(page.getByText("errors were encountered")).toBeVisible();

  /* eslint-disable playwright/no-raw-locators, playwright/no-nth-methods */
  await expect(page.locator(".mdc-data-table__row").first()).toContainText(
    "PATH/TO/FILE",
  );
  await expect(page.locator(".mdc-data-table__row").first()).toContainText(
    "ERROR MESSAGE 1",
  );
  await expect(page.locator(".mdc-data-table__row").nth(1)).toContainText(
    "PATH/TO/SECOND/FILE",
  );
  await expect(page.locator(".mdc-data-table__row").nth(1)).toContainText(
    "ERROR MESSAGE 2",
  );
  /* eslint-enable */

  const moveCalls = getCalls("move");
  expect(moveCalls).toHaveLength(1);
  expect(moveCalls[0]).toStrictEqual(["root", "root", true, true, false]);
});
