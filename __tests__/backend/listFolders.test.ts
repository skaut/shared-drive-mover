import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import { listFolders } from "../../src/backend/listFolders";
import { SafeDriveService_ } from "../../src/backend/utils/SafeDriveService";
import { mockedSession } from "../test-utils/gas-stubs";
import { mockedSafeDriveService } from "../test-utils/SafeDriveService-stub";

jest.mock<{ SafeDriveService_: jest.Mock }>(
  "../../src/backend/utils/SafeDriveService",
  () => ({
    SafeDriveService_: jest.fn(),
  }),
);

test("listFolders works correctly", () => {
  interface ListFilesOptions {
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
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);
  mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders("ID_PARENT")).toStrictEqual({
    response: [
      { id: "ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
    status: "success",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain("ID_PARENT");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .pageToken,
  ).toBeUndefined();
});

test("listFolders works correctly with shortcuts", () => {
  interface ListFilesOptions {
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
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);
  mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders("ID_PARENT")).toStrictEqual({
    response: [
      { id: "TRUE_ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
    status: "success",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain("ID_PARENT");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .pageToken,
  ).toBeUndefined();
});

test("listFolders handles invalid parameters gracefully", () => {
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders(42)).toStrictEqual({
    status: "error",
    type: "invalidParameter",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(0);
});

test("listFolders handles errors in Google Drive API gracefully", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders("ID_PARENT")).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain("ID_PARENT");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .pageToken,
  ).toBeUndefined();
});
