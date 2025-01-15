import { expect, test, vi } from "vitest";

import {
  deleteFolderIfEmpty_,
  isFolderEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "../../../src/backend/move/folderManagement";
import { mockedSafeDriveService } from "../test-utils/SafeDriveService-stub";

test("listFilesInFolder works correctly", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const items = [
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "FILE1_ID",
      title: "FILE1_TITLE",
    },
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "FILE2_ID",
      title: "FILE2_TITLE",
    },
  ];
  const rawResponse = {
    items,
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(rawResponse);

  expect(listFilesInFolder_("FOLDER_ID", driveServiceMock)).toStrictEqual(
    items,
  );

  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][0]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain('mimeType != "application/vnd.google-apps.folder"');
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
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][0]).toStrictEqual(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: true,
      title: true,
    },
  );
});

test("listFoldersInFolder works correctly", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const items = [
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "FILE1_ID",
      title: "FILE1_TITLE",
    },
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "FILE2_ID",
      title: "FILE2_TITLE",
    },
  ];
  const rawResponse = {
    items,
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(rawResponse);

  expect(listFoldersInFolder_("FOLDER_ID", driveServiceMock)).toStrictEqual(
    items,
  );

  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][0]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
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
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][0]).toStrictEqual(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: true,
      title: true,
    },
  );
});

test("isFolderEmpty works correctly with an empty folder", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    items: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(rawResponse);

  expect(isFolderEmpty_("ID_FOLDER", driveServiceMock)).toBe(true);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][0]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain("ID_FOLDER");
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
});

test("isFolderEmpty works correctly with a non-empty folder", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    items: [{ id: "ID_FILE" }],
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(rawResponse);

  expect(isFolderEmpty_("ID_FOLDER", driveServiceMock)).toBe(false);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][0]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain("ID_FOLDER");
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
});

test.each(["owner", "organizer"] as Array<
  "fileOrganizer" | "organizer" | "owner" | "reader" | "writer"
>)(
  "deleteFolderIfEmpty works correctly",
  (role: "fileOrganizer" | "organizer" | "owner" | "reader" | "writer") => {
    interface ListFilesOptions {
      includeItemsFromAllDrives?: boolean;
      maxResults?: number;
      pageToken?: string;
      q?: string;
      supportsAllDrives?: boolean;
    }

    const getResponse = {
      userPermission: { role },
    };
    const listResponse = {
      items: [],
      nextPageToken: undefined,
    };
    const driveServiceMock = mockedSafeDriveService();
    vi.mocked(driveServiceMock.Files.get).mockReturnValueOnce(getResponse);
    vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(listResponse);

    deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

    expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
    expect(
      vi.mocked(driveServiceMock.Files.list).mock.calls[0][0],
    ).toBeDefined();
    expect(
      (
        vi.mocked(driveServiceMock.Files.list).mock
          .calls[0][1] as ListFilesOptions
      ).q,
    ).toContain('"FOLDER_ID" in parents');
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
    expect(vi.mocked(driveServiceMock.Files.get).mock.calls).toHaveLength(1);
    expect(vi.mocked(driveServiceMock.Files.get).mock.calls[0][0]).toBe(
      "FOLDER_ID",
    );
    expect(
      vi.mocked(driveServiceMock.Files.get).mock.calls[0][1],
    ).toBeDefined();
    expect(
      vi.mocked(driveServiceMock.Files.get).mock.calls[0][1],
    ).toStrictEqual({
      userPermission: { role: true },
    });
    expect(vi.mocked(driveServiceMock.Files.remove).mock.calls).toHaveLength(1);
    expect(vi.mocked(driveServiceMock.Files.remove).mock.calls[0][0]).toBe(
      "FOLDER_ID",
    );
  },
);

test("deleteFolderIfEmpty doesn't delete a non-empty folder", () => {
  interface ListFilesOptions {
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const listResponse = {
    items: [{ userPermission: { role: "reader" } }],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(listResponse);

  deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

  expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.list).mock.calls[0][0]).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.list).mock
        .calls[0][1] as ListFilesOptions
    ).q,
  ).toContain('"FOLDER_ID" in parents');
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
  expect(vi.mocked(driveServiceMock.Files.get).mock.calls).toHaveLength(0);
  expect(vi.mocked(driveServiceMock.Files.remove).mock.calls).toHaveLength(0);
});

test.each(["fileOrganizer", "reader", "writer"] as Array<
  "fileOrganizer" | "organizer" | "owner" | "reader" | "writer"
>)(
  "deleteFolderIfEmpty doesn't try to delete a folder without permissions",
  (role: "fileOrganizer" | "organizer" | "owner" | "reader" | "writer") => {
    interface ListFilesOptions {
      includeItemsFromAllDrives?: boolean;
      maxResults?: number;
      pageToken?: string;
      q?: string;
      supportsAllDrives?: boolean;
    }

    const getResponse = {
      userPermission: { role },
    };
    const listResponse = {
      items: [],
      nextPageToken: undefined,
    };
    const driveServiceMock = mockedSafeDriveService();
    vi.mocked(driveServiceMock.Files.get).mockReturnValueOnce(getResponse);
    vi.mocked(driveServiceMock.Files.list).mockReturnValueOnce(listResponse);

    deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

    expect(vi.mocked(driveServiceMock.Files.list).mock.calls).toHaveLength(1);
    expect(
      vi.mocked(driveServiceMock.Files.list).mock.calls[0][0],
    ).toBeDefined();
    expect(
      (
        vi.mocked(driveServiceMock.Files.list).mock
          .calls[0][1] as ListFilesOptions
      ).q,
    ).toContain('"FOLDER_ID" in parents');
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
    expect(vi.mocked(driveServiceMock.Files.get).mock.calls).toHaveLength(1);
    expect(vi.mocked(driveServiceMock.Files.get).mock.calls[0][0]).toBe(
      "FOLDER_ID",
    );
    expect(
      vi.mocked(driveServiceMock.Files.get).mock.calls[0][1],
    ).toBeDefined();
    expect(
      vi.mocked(driveServiceMock.Files.get).mock.calls[0][1],
    ).toStrictEqual({
      userPermission: { role: true },
    });
    expect(vi.mocked(driveServiceMock.Files.remove).mock.calls).toHaveLength(0);
  },
);
