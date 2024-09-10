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
    fields?: string;
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
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(listFilesInFolder_("FOLDER_ID", driveServiceMock)).toStrictEqual(
    items,
  );

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType != "application/vnd.google-apps.folder"');
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
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).fields,
  ).toContain("id");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).fields,
  ).toContain("title");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).fields,
  ).toContain("canMoveItemOutOfDrive");
});

test("listFoldersInFolder works correctly", () => {
  interface ListFilesOptions {
    fields?: string;
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
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(listFoldersInFolder_("FOLDER_ID", driveServiceMock)).toStrictEqual(
    items,
  );

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
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
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).fields,
  ).toContain("id");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).fields,
  ).toContain("title");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).fields,
  ).toContain("canMoveItemOutOfDrive");
});

test("isFolderEmpty works correctly with an empty folder", () => {
  interface ListFilesOptions {
    fields?: string;
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    items: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(isFolderEmpty_("ID_FOLDER", driveServiceMock)).toBe(true);
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("ID_FOLDER");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
});

test("isFolderEmpty works correctly with a non-empty folder", () => {
  interface ListFilesOptions {
    fields?: string;
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const rawResponse = {
    items: [{ id: "ID_FILE" }],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(rawResponse);

  expect(isFolderEmpty_("ID_FOLDER", driveServiceMock)).toBe(false);
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("ID_FOLDER");
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
});

test.each(["owner", "organizer"] as Array<
  "fileOrganizer" | "organizer" | "owner" | "reader" | "writer"
>)(
  "deleteFolderIfEmpty works correctly",
  (role: "fileOrganizer" | "organizer" | "owner" | "reader" | "writer") => {
    interface ListFilesOptions {
      fields?: string;
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
    driveServiceMock.Files.get.mockReturnValueOnce(getResponse);
    driveServiceMock.Files.list.mockReturnValueOnce(listResponse);

    deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

    expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
    expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
    expect(
      (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
    ).toContain('"FOLDER_ID" in parents');
    expect(
      (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
        .includeItemsFromAllDrives,
    ).toBe(true);
    expect(
      (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
        .supportsAllDrives,
    ).toBe(true);
    expect(driveServiceMock.Files.get.mock.calls).toHaveLength(1);
    expect(driveServiceMock.Files.get.mock.calls[0][0]).toBe("FOLDER_ID");
    expect(driveServiceMock.Files.get.mock.calls[0][1]).toBeDefined();
    expect(driveServiceMock.Files.get.mock.calls[0][1]).toStrictEqual({
      userPermission: { role: true },
    });
    expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(1);
    expect(driveServiceMock.Files.remove.mock.calls[0][0]).toBe("FOLDER_ID");
  },
);

test("deleteFolderIfEmpty doesn't delete a non-empty folder", () => {
  interface ListFilesOptions {
    fields?: string;
    includeItemsFromAllDrives?: boolean;
    maxResults?: number;
    pageToken?: string;
    q?: string;
    supportsAllDrives?: boolean;
  }

  const listResponse: GoogleAppsScript.Drive.Schema.FileList = {
    items: [{ userPermission: { role: "reader" } }],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(listResponse);

  deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .includeItemsFromAllDrives,
  ).toBe(true);
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(driveServiceMock.Files.get.mock.calls).toHaveLength(0);
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(0);
});

test.each(["fileOrganizer", "reader", "writer"] as Array<
  "fileOrganizer" | "organizer" | "owner" | "reader" | "writer"
>)(
  "deleteFolderIfEmpty doesn't try to delete a folder without permissions",
  (role: "fileOrganizer" | "organizer" | "owner" | "reader" | "writer") => {
    interface ListFilesOptions {
      fields?: string;
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
    driveServiceMock.Files.get.mockReturnValueOnce(getResponse);
    driveServiceMock.Files.list.mockReturnValueOnce(listResponse);

    deleteFolderIfEmpty_("FOLDER_ID", driveServiceMock);

    expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
    expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
    expect(
      (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
    ).toContain('"FOLDER_ID" in parents');
    expect(
      (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
        .includeItemsFromAllDrives,
    ).toBe(true);
    expect(
      (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions)
        .supportsAllDrives,
    ).toBe(true);
    expect(driveServiceMock.Files.get.mock.calls).toHaveLength(1);
    expect(driveServiceMock.Files.get.mock.calls[0][0]).toBe("FOLDER_ID");
    expect(driveServiceMock.Files.get.mock.calls[0][1]).toBeDefined();
    expect(driveServiceMock.Files.get.mock.calls[0][1]).toStrictEqual({
      userPermission: { role: true },
    });
    expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(0);
  },
);
