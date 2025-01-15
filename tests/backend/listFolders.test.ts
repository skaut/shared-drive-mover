import { expect, test, vi } from "vitest";

import { listFolders } from "../../src/backend/listFolders";
import { SafeDriveService_ } from "../../src/backend/utils/SafeDriveService";
import { mockedSession } from "./test-utils/gas-stubs";
import { mockedSafeDriveService } from "./test-utils/SafeDriveService-stub";

vi.mock("../../src/backend/utils/SafeDriveService");

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
  vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(rawResponse);
  vi.mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  vi.mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders("ID_PARENT")).toStrictEqual({
    response: [
      { id: "ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
    status: "success",
  });
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][1]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain("ID_PARENT");
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).pageToken,
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
  vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(rawResponse);
  vi.mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  vi.mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders("ID_PARENT")).toStrictEqual({
    response: [
      { id: "TRUE_ID1", name: "FOLDER1" },
      { id: "ID2", name: "FOLDER2" },
    ],
    status: "success",
  });
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][1]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain("ID_PARENT");
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).pageToken,
  ).toBeUndefined();
});

test("listFolders handles invalid parameters gracefully", () => {
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.list).mockImplementationOnce(() => {
    throw new Error();
  });
  vi.mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  vi.mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders(42)).toStrictEqual({
    status: "error",
    type: "invalidParameter",
  });
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(0);
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
  vi.mocked(driveServiceMock.Files.list).mockImplementationOnce(() => {
    throw new Error();
  });
  vi.mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  global.Session = mockedSession();
  vi.mocked(global.Session).getActiveUserLocale.mockReturnValueOnce("en");

  expect(listFolders("ID_PARENT")).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][1]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain("ID_PARENT");
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).pageToken,
  ).toBeUndefined();
});
