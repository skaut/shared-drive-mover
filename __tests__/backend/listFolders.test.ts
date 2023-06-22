import { expect, jest, test } from "@jest/globals";

import { listFolders } from "../../src/backend/listFolders";
import {
  mockedDrive,
  mockedFilesCollection,
  mockedSession,
} from "../test-utils/gas-stubs";

test("listFolders works correctly", () => {
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    pageToken?: string;
    maxResults?: number;
    fields?: string;
  }

  const rawResponse = {
    items: [
      { id: "ID1", title: "FOLDER1" },
      { id: "ID2", title: "FOLDER2" },
    ],
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  global.Session = {
    ...mockedSession(),
    getActiveUserLocale: jest.fn<() => string>().mockReturnValueOnce("en"),
  };

  expect(listFolders("ID_PARENT")).toStrictEqual({
    status: "success",
    response: [
      { id: "ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
  });
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.q).toContain("ID_PARENT");
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.pageToken).toBeUndefined();
  expect(
    list.mock.calls[0][0]!.fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
});

test("listFolders works correctly with shortcuts", () => {
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    pageToken?: string;
    maxResults?: number;
    fields?: string;
  }

  const rawResponse = {
    items: [
      {
        id: "ID1",
        title: "FOLDER1",
        mimeType: "application/vnd.google-apps.shortcut",
        shortcutDetails: {
          targetId: "TRUE_ID1",
        },
      },
      { id: "ID2", title: "FOLDER2" },
    ],
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  global.Session = {
    ...mockedSession(),
    getActiveUserLocale: jest.fn<() => string>().mockReturnValueOnce("en"),
  };

  expect(listFolders("ID_PARENT")).toStrictEqual({
    status: "success",
    response: [
      { id: "TRUE_ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
  });
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.q).toContain("ID_PARENT");
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.pageToken).toBeUndefined();
  expect(
    list.mock.calls[0][0]!.fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
});

test("listFolders handles errors in Google Drive API gracefully", () => {
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    pageToken?: string;
    maxResults?: number;
    fields?: string;
  }

  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockImplementationOnce(() => {
      throw new Error();
    });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  global.Session = {
    ...mockedSession(),
    getActiveUserLocale: jest.fn<() => string>().mockReturnValueOnce("en"),
  };

  expect(listFolders("ID_PARENT")).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.q).toContain("ID_PARENT");
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.pageToken).toBeUndefined();
  expect(
    list.mock.calls[0][0]!.fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
});
