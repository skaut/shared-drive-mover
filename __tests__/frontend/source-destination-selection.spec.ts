import { expect, test } from "playwright-test-coverage";

import { setup } from "../test-utils/stub-endpoints";

test("works with folder selection", async ({ page }) => {
  await page.goto("/");
  const getCalls = await setup(page);

  await page.evaluate(() => {
    window._endpointStubs["listFolders"] = [
      {
        status: "success",
        value: {
          response: [],
          status: "success",
        },
      },
      {
        status: "success",
        value: {
          response: [
            {
              id: "ID_DRIVE_1_FOLDER_1",
              name: "FOLDER 1 IN DRIVE 1",
            },
            {
              id: "ID_DRIVE_1_FOLDER_2",
              name: "FOLDER 2 IN DRIVE 1",
            },
          ],
          status: "success",
        },
      },
      {
        status: "success",
        value: {
          response: [
            {
              id: "ID_MY_DRIVE_FOLDER_1",
              name: "FOLDER 1 IN MY DRIVE",
            },
            {
              id: "ID_MY_DRIVE_FOLDER_2",
              name: "FOLDER 2 IN MY DRIVE",
            },
          ],
          status: "success",
        },
      },
      {
        status: "success",
        value: {
          response: [
            {
              id: "ID_MY_DRIVE_FOLDER_2_FOLDER_1",
              name: "FOLDER 1 IN FOLDER 2 IN MY DRIVE",
            },
            {
              id: "ID_MY_DRIVE_FOLDER_2_FOLDER_2",
              name: "FOLDER 2 IN FOLDER 2 IN MY DRIVE",
            },
          ],
          status: "success",
        },
      },
      {
        status: "success",
        value: {
          response: [
            {
              id: "ID_MY_DRIVE_FOLDER_1",
              name: "FOLDER 1 IN MY DRIVE",
            },
            {
              id: "ID_MY_DRIVE_FOLDER_2",
              name: "FOLDER 2 IN MY DRIVE",
            },
          ],
          status: "success",
        },
      },
      {
        status: "success",
        value: {
          response: [
            {
              id: "ID_MY_DRIVE_FOLDER_1_FOLDER_1",
              name: "FOLDER 1 IN FOLDER 1 IN MY DRIVE",
            },
            {
              id: "ID_MY_DRIVE_FOLDER_1_FOLDER_2",
              name: "FOLDER 2 IN FOLDER 1 IN MY DRIVE",
            },
          ],
          status: "success",
        },
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
  await page.getByText("DRIVE 2").dblclick();
  await page.getByText("Drive Selection").dblclick();
  await page.getByText("DRIVE 1").dblclick();
  await page.getByText("FOLDER 2 IN DRIVE 1").click();
  await page.getByText("Continue").click();
  await page.getByText("My Drive").dblclick();
  await page.getByText("FOLDER 2 IN MY DRIVE").dblclick();
  await page.getByText("My Drive", { exact: true }).click();
  await page.getByText("FOLDER 1 IN MY DRIVE").dblclick();
  await page.getByText("FOLDER 2 IN FOLDER 1 IN MY DRIVE").click();
  await page.getByText("Continue").click();
  await expect(
    page.getByText(
      'contents of the folder "DRIVE 1/FOLDER 2 IN DRIVE 1" into the folder "My Drive/FOLDER 1 IN MY DRIVE/FOLDER 2 IN FOLDER 1 IN MY DRIVE"',
    ),
  ).toBeVisible();
  await page.getByText("Move", { exact: true }).click();
  await expect(page.getByText("Done!", { exact: true })).toBeVisible();
  await expect(page.getByText("Successfully moved")).toBeVisible();

  const listFolderCalls = getCalls("listFolders");
  expect(listFolderCalls).toHaveLength(6);
  expect(listFolderCalls[0]).toStrictEqual(["ID_DRIVE_2"]);
  expect(listFolderCalls[1]).toStrictEqual(["ID_DRIVE_1"]);
  expect(listFolderCalls[2]).toStrictEqual(["root"]);
  expect(listFolderCalls[3]).toStrictEqual(["ID_MY_DRIVE_FOLDER_2"]);
  expect(listFolderCalls[4]).toStrictEqual(["root"]);
  expect(listFolderCalls[5]).toStrictEqual(["ID_MY_DRIVE_FOLDER_1"]);

  const moveCalls = getCalls("move");
  expect(moveCalls).toHaveLength(1);
  expect(moveCalls[0]).toStrictEqual([
    "ID_DRIVE_1_FOLDER_2",
    "ID_MY_DRIVE_FOLDER_1_FOLDER_2",
    true,
    true,
    false,
  ]);
});
