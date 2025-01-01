import { expect, test } from "@jest/globals";

import {
  deleteFolderIfEmpty_,
  isFolderEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "../../../src/backend/move/folderManagement";
import { mockedSafeDriveService } from "../../test-utils/SafeDriveService-stub";

test("listFilesInFolder works correctly", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const files = [
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "FILE1_ID",
      name: "FILE1_TITLE",
    },
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "FILE2_ID",
      name: "FILE2_TITLE",
    },
  ];
  const rawResponse = {
    files,
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(listFilesInFolder_("FOLDER_ID", driveServiceMock)).toStrictEqual(
    files,
  );

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain('mimeType != "application/vnd.google-apps.folder"');
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
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toStrictEqual({
    capabilities: { canMoveItemOutOfDrive: true },
    id: true,
    name: true,
  });
});

test("listFoldersInFolder works correctly", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const files = [
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "FILE1_ID",
      name: "FILE1_TITLE",
    },
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "FILE2_ID",
      name: "FILE2_TITLE",
    },
  ];
  const rawResponse = {
    files,
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(listFoldersInFolder_("FOLDER_ID", driveServiceMock)).toStrictEqual(
    files,
  );

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
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
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toStrictEqual({
    capabilities: { canMoveItemOutOfDrive: true },
    id: true,
    name: true,
  });
});

test("isFolderEmpty works correctly with an empty folder", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    files: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(isFolderEmpty_("ID_FOLDER", driveServiceMock)).toBe(true);
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain("ID_FOLDER");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
});

test("isFolderEmpty works correctly with a non-empty folder", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    files: [{ id: "ID_FILE" }],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(isFolderEmpty_("ID_FOLDER", driveServiceMock)).toBe(false);
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain("ID_FOLDER");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
});

test("deleteFolderIfEmpty works correctly", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const getResponse = {
    capabilities: {
      canDelete: true,
    },
  };
  const listResponse = {
    files: [],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.get.mockReturnValueOnce(getResponse);
  driveServiceMock.Files.list.mockReturnValueOnce(listResponse);

  deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(driveServiceMock.Files.get.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.get.mock.calls[0][0]).toBe("FOLDER_ID");
  expect(driveServiceMock.Files.get.mock.calls[0][1]).toBeDefined();
  expect(driveServiceMock.Files.get.mock.calls[0][1]).toStrictEqual({
    capabilities: { canDelete: true },
  });
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.remove.mock.calls[0][0]).toBe("FOLDER_ID");
});

test("deleteFolderIfEmpty doesn't delete a non-empty folder", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const listResponse = {
    files: [{ userPermission: { role: "reader" } }],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(listResponse);

  deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(driveServiceMock.Files.get.mock.calls).toHaveLength(0);
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(0);
});

test("deleteFolderIfEmpty doesn't try to delete a folder without permissions", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const getResponse = {
    capabilities: {
      canDelete: false,
    },
  };
  const listResponse = {
    files: [],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.get.mockReturnValueOnce(getResponse);
  driveServiceMock.Files.list.mockReturnValueOnce(listResponse);

  deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][1] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(driveServiceMock.Files.get.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.get.mock.calls[0][0]).toBe("FOLDER_ID");
  expect(driveServiceMock.Files.get.mock.calls[0][1]).toBeDefined();
  expect(driveServiceMock.Files.get.mock.calls[0][1]).toStrictEqual({
    capabilities: { canDelete: true },
  });
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(0);
});
