import {
  mockedDrive,
  mockedFilesCollection,
} from "../../test-utils/mocked-gas";

import {
  deleteFolderIfEmpty_,
  isFolderEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "../../../src/backend/move/folderManagement";

test("listFilesInFolder works correctly", () => {
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    pageToken?: string;
    maxResults?: number;
    fields?: string;
  }

  const items = [
    {
      id: "FILE1_ID",
      title: "FILE1_TITLE",
      capabilities: { canMoveItemOutOfDrive: true },
    },
    {
      id: "FILE2_ID",
      title: "FILE2_TITLE",
      capabilities: { canMoveItemOutOfDrive: false },
    },
  ];
  const rawResponse = {
    items,
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      GoogleAppsScript.Drive.Schema.FileList,
      [optionalArgs?: ListFilesOptions]
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  expect(listFilesInFolder_("FOLDER_ID")).toStrictEqual(items);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).not.toBeUndefined();
  expect(list.mock.calls[0][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[0][0]!.q).toContain(
    'mimeType != "application/vnd.google-apps.folder"'
  );
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.pageToken).toBeUndefined();
  expect(list.mock.calls[0][0]!.fields).toContain("id");
  expect(list.mock.calls[0][0]!.fields).toContain("title");
  expect(list.mock.calls[0][0]!.fields).toContain("canMoveItemOutOfDrive");
});

test("listFoldersInFolder works correctly", () => {
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    pageToken?: string;
    maxResults?: number;
    fields?: string;
  }

  const items = [
    {
      id: "FILE1_ID",
      title: "FILE1_TITLE",
      capabilities: { canMoveItemOutOfDrive: true },
    },
    {
      id: "FILE2_ID",
      title: "FILE2_TITLE",
      capabilities: { canMoveItemOutOfDrive: false },
    },
  ];
  const rawResponse = {
    items,
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      GoogleAppsScript.Drive.Schema.FileList,
      [optionalArgs?: ListFilesOptions]
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  expect(listFoldersInFolder_("FOLDER_ID")).toStrictEqual(items);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).not.toBeUndefined();
  expect(list.mock.calls[0][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[0][0]!.q).toContain(
    'mimeType = "application/vnd.google-apps.folder"'
  );
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.pageToken).toBeUndefined();
  expect(list.mock.calls[0][0]!.fields).toContain("id");
  expect(list.mock.calls[0][0]!.fields).toContain("title");
  expect(list.mock.calls[0][0]!.fields).toContain("canMoveItemOutOfDrive");
});

test("isFolderEmpty works correctly with an empty folder", () => {
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    maxResults?: number;
    fields?: string;
  }

  const rawResponse = {
    items: [],
  };
  const list = jest
    .fn<
      GoogleAppsScript.Drive.Schema.FileList,
      [optionalArgs?: ListFilesOptions]
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  expect(isFolderEmpty_("ID_FOLDER")).toBe(true);
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).not.toBeUndefined();
  expect(list.mock.calls[0][0]!.q).toContain("ID_FOLDER");
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
});

test("isFolderEmpty works correctly with a non-empty folder", () => {
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    maxResults?: number;
    fields?: string;
  }

  const rawResponse = {
    items: [{ id: "ID_FILE" }],
  };
  const list = jest
    .fn<
      GoogleAppsScript.Drive.Schema.FileList,
      [optionalArgs?: ListFilesOptions]
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  expect(isFolderEmpty_("ID_FOLDER")).toBe(false);
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).not.toBeUndefined();
  expect(list.mock.calls[0][0]!.q).toContain("ID_FOLDER");
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
});

test.each(["owner", "organizer"] as Array<
  "fileOrganizer" | "organizer" | "owner" | "reader" | "writer"
>)(
  "deleteFolderIfEmpty works correctly",
  (role: "fileOrganizer" | "organizer" | "owner" | "reader" | "writer") => {
    interface GetFileOptions {
      fields?: string;
    }
    interface ListFilesOptions {
      q?: string;
      includeItemsFromAllDrives?: boolean;
      supportsAllDrives?: boolean;
      pageToken?: string;
      maxResults?: number;
      fields?: string;
    }

    const getResponse = {
      userPermission: { role },
    };
    const get = jest
      .fn<
        GoogleAppsScript.Drive.Schema.File,
        [fileId: string, optionalArgs?: GetFileOptions]
      >()
      .mockReturnValueOnce(getResponse);
    const listResponse = {
      items: [],
      nextPageToken: undefined,
    };
    const list = jest
      .fn<
        GoogleAppsScript.Drive.Schema.FileList,
        [optionalArgs?: ListFilesOptions]
      >()
      .mockReturnValueOnce(listResponse);
    const remove = jest.fn<void, [fileId: string]>().mockReturnValueOnce(); // eslint-disable-line @typescript-eslint/no-invalid-void-type
    global.Drive = {
      ...mockedDrive(),
      Files: {
        ...mockedFilesCollection(),
        get,
        list,
        remove,
      },
    };

    deleteFolderIfEmpty_("FOLDER_ID");

    expect(list.mock.calls).toHaveLength(1);
    expect(list.mock.calls[0][0]).not.toBeUndefined();
    expect(list.mock.calls[0][0]!.q).toContain('"FOLDER_ID" in parents');
    expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
    expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
    expect(get.mock.calls).toHaveLength(1);
    expect(get.mock.calls[0][0]).toBe("FOLDER_ID");
    expect(get.mock.calls[0][1]).not.toBeUndefined();
    expect(get.mock.calls[0][1]!.fields).toContain("role");
    expect(remove.mock.calls).toHaveLength(1);
    expect(remove.mock.calls[0][0]).toBe("FOLDER_ID");
  }
);

test("deleteFolderIfEmpty doesn't delete a non-empty folder", () => {
  interface GetFileOptions {
    fields?: string;
  }
  interface ListFilesOptions {
    q?: string;
    includeItemsFromAllDrives?: boolean;
    supportsAllDrives?: boolean;
    pageToken?: string;
    maxResults?: number;
    fields?: string;
  }

  const get = jest.fn<
    GoogleAppsScript.Drive.Schema.File,
    [fileId: string, optionalArgs?: GetFileOptions]
  >();
  const listResponse: GoogleAppsScript.Drive.Schema.FileList = {
    items: [{ userPermission: { role: "reader" } }],
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      GoogleAppsScript.Drive.Schema.FileList,
      [optionalArgs?: ListFilesOptions]
    >()
    .mockReturnValueOnce(listResponse);
  const remove = jest.fn<void, [fileId: string]>(); // eslint-disable-line @typescript-eslint/no-invalid-void-type
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      get,
      list,
      remove,
    },
  };

  deleteFolderIfEmpty_("FOLDER_ID");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).not.toBeUndefined();
  expect(list.mock.calls[0][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
  expect(get.mock.calls).toHaveLength(0);
  expect(remove.mock.calls).toHaveLength(0);
});

test.each(["fileOrganizer", "reader", "writer"] as Array<
  "fileOrganizer" | "organizer" | "owner" | "reader" | "writer"
>)(
  "deleteFolderIfEmpty doesn't try to delete a folder without permissions",
  (role: "fileOrganizer" | "organizer" | "owner" | "reader" | "writer") => {
    interface GetFileOptions {
      fields?: string;
    }
    interface ListFilesOptions {
      q?: string;
      includeItemsFromAllDrives?: boolean;
      supportsAllDrives?: boolean;
      pageToken?: string;
      maxResults?: number;
      fields?: string;
    }

    const getResponse = {
      userPermission: { role },
    };
    const get = jest
      .fn<
        GoogleAppsScript.Drive.Schema.File,
        [fileId: string, optionalArgs?: GetFileOptions]
      >()
      .mockReturnValueOnce(getResponse);
    const listResponse = {
      items: [],
      nextPageToken: undefined,
    };
    const list = jest
      .fn<
        GoogleAppsScript.Drive.Schema.FileList,
        [optionalArgs?: ListFilesOptions]
      >()
      .mockReturnValueOnce(listResponse);
    const remove = jest.fn<void, [fileId: string]>(); // eslint-disable-line @typescript-eslint/no-invalid-void-type
    global.Drive = {
      ...mockedDrive(),
      Files: {
        ...mockedFilesCollection(),
        get,
        list,
        remove,
      },
    };

    deleteFolderIfEmpty_("FOLDER_ID");

    expect(list.mock.calls).toHaveLength(1);
    expect(list.mock.calls[0][0]).not.toBeUndefined();
    expect(list.mock.calls[0][0]!.q).toContain('"FOLDER_ID" in parents');
    expect(list.mock.calls[0][0]!.includeItemsFromAllDrives).toBe(true);
    expect(list.mock.calls[0][0]!.supportsAllDrives).toBe(true);
    expect(get.mock.calls).toHaveLength(1);
    expect(get.mock.calls[0][0]).toBe("FOLDER_ID");
    expect(get.mock.calls[0][1]).not.toBeUndefined();
    expect(get.mock.calls[0][1]!.fields).toContain("role");
    expect(remove.mock.calls).toHaveLength(0);
  }
);
