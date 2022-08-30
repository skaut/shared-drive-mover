import { expect, jest, test } from "@jest/globals";

import { mockedDrive, mockedDrivesCollection } from "../test-utils/gas-stubs";

import { listSharedDrives } from "../../src/backend/listSharedDrives";

test("listSharedDrives works correctly", () => {
  interface ListDrivesOptions {
    pageToken?: string;
    maxResults?: number;
    orderBy?: string;
    fields?: string;
  }

  const response = [
    { id: "ID1", name: "DRIVE1" },
    { id: "ID2", name: "DRIVE2" },
  ];
  const rawResponse = {
    items: response,
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      (
        optionalArgs?: ListDrivesOptions
      ) => GoogleAppsScript.Drive.Schema.DriveList
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    ...mockedDrive(),
    Drives: {
      ...mockedDrivesCollection(),
      list,
    },
  };

  expect(listSharedDrives()).toStrictEqual({ status: "success", response });
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.pageToken).toBeUndefined();
  expect(list.mock.calls[0][0]!.orderBy).toBe("name");
  expect(
    list.mock.calls[0][0]!.fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
});

test("listSharedDrives handles Drive API error gracefully", () => {
  interface ListDrivesOptions {
    pageToken?: string;
    maxResults?: number;
    orderBy?: string;
    fields?: string;
  }

  const list = jest
    .fn<
      (
        optionalArgs?: ListDrivesOptions
      ) => GoogleAppsScript.Drive.Schema.DriveList
    >()
    .mockImplementationOnce(() => {
      throw new Error();
    });
  global.Drive = {
    ...mockedDrive(),
    Drives: {
      ...mockedDrivesCollection(),
      list,
    },
  };

  expect(listSharedDrives()).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.pageToken).toBeUndefined();
  expect(list.mock.calls[0][0]!.orderBy).toBe("name");
  expect(
    list.mock.calls[0][0]!.fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
});
