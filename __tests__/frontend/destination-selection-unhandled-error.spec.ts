import { expect, test } from "playwright-test-coverage";

import { setup } from "../test-utils/stub-endpoints";

test("handles raw errors in source folder selection gracefully", async ({
  page,
}) => {
  await page.goto("/");
  await setup(page);

  await page.evaluate(() => {
    window._endpointStubs["listFolders"] = [
      {
        status: "failure",
        value: new Error("ERROR MESSAGE"),
      },
    ];
    window._endpointStubs["listSharedDrives"] = [
      {
        status: "success",
        value: {
          response: [
            { id: "ID_DRIVE_1", name: "DRIVE 1" },
            { id: "ID_DRIVE_2", name: "DRIVE 2" },
          ],
          status: "success",
        },
      },
      {
        status: "success",
        value: {
          response: [
            { id: "ID_DRIVE_1", name: "DRIVE 1" },
            { id: "ID_DRIVE_2", name: "DRIVE 2" },
          ],
          status: "success",
        },
      },
    ];
  });

  await expect(
    page.getByText("Shared drive mover", { exact: true }),
  ).toBeVisible();
  await page.getByText("Continue").click();
  await page.getByText("DRIVE 1").click();
  await page.getByText("Continue").click();
  await page.getByText("DRIVE 2").dblclick();
  await expect(
    page.getByText("An error occurred", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("ERROR MESSAGE")).toBeVisible();
});
