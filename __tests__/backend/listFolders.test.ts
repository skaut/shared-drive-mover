import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import { listFolders } from "../../src/backend/listFolders";
import { DriveService_ } from "../../src/backend/utils/DriveService";
import { mockedDriveService } from "../test-utils/DriveService-stub";
import { mockedSession } from "../test-utils/gas-stubs";

/* eslint-disable @typescript-eslint/naming-convention -- Properties are mock classes */
jest.mock<{ DriveService_: jest.Mock }>(
  "../../src/backend/utils/DriveService",
  () => ({
    DriveService_: jest.fn(),
  }),
);
/* eslint-enable */

test("listFolders works correctly", () => {
  interface ListFilesOptions {
    fields?: string;
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    items: [
      { id: "ID1", title: "FOLDER1" },
      { id: "ID2", title: "FOLDER2" },
    ],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);
  mocked(DriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = {
    ...mockedSession(),
    getActiveUserLocale: jest.fn<() => string>().mockReturnValueOnce("en"),
  };

  expect(listFolders("ID_PARENT")).toStrictEqual({
    response: [
      { id: "ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
    status: "success",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("ID_PARENT");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .fields!.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
});

test("listFolders works correctly with shortcuts", () => {
  interface ListFilesOptions {
    fields?: string;
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    items: [
      {
        id: "ID1",
        mimeType: "application/vnd.google-apps.shortcut",
        shortcutDetails: {
          targetId: "TRUE_ID1",
        },
        title: "FOLDER1",
      },
      { id: "ID2", title: "FOLDER2" },
    ],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);
  mocked(DriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = {
    ...mockedSession(),
    getActiveUserLocale: jest.fn<() => string>().mockReturnValueOnce("en"),
  };

  expect(listFolders("ID_PARENT")).toStrictEqual({
    response: [
      { id: "TRUE_ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
    status: "success",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("ID_PARENT");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .fields!.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
});

test("listFolders handles invalid parameters gracefully", () => {
  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.list.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(DriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = {
    ...mockedSession(),
    getActiveUserLocale: jest.fn<() => string>().mockReturnValueOnce("en"),
  };

  expect(listFolders(42)).toStrictEqual({
    status: "error",
    type: "invalidParameter",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(0);
});

test("listFolders handles errors in Google Drive API gracefully", () => {
  interface ListFilesOptions {
    fields?: string;
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.list.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(DriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = {
    ...mockedSession(),
    getActiveUserLocale: jest.fn<() => string>().mockReturnValueOnce("en"),
  };

  expect(listFolders("ID_PARENT")).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("ID_PARENT");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .fields!.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
});
