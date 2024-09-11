import { expect, jest, test } from "@jest/globals";

import { SafeFilesCollection_ } from "../../../../src/backend/utils/SafeDriveService/SafeFilesCollection";
import {
  mockedDrive,
  mockedFilesCollection,
} from "../../../test-utils/gas-stubs";

test("SafeFilesCollection constructs correctly", () => {
  global.Drive = {
    ...mockedDrive(),
    Files: mockedFilesCollection(),
  };

  expect(() => {
    new SafeFilesCollection_();
  }).not.toThrow();
});

test("SafeFilesCollection throws an error without the Files collection", () => {
  global.Drive = {
    ...mockedDrive(),
  };

  expect(() => {
    new SafeFilesCollection_();
  }).toThrow("");
});

test("copy works", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const copy = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.copy(file, "TARGET_ID", null)).toBe(file);

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0]).toBe(file);
  expect(copy.mock.calls[0][1]).toBe("TARGET_ID");
  expect(copy.mock.calls[0][2]).toStrictEqual({});
});

test("copy works with optional arguments", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const copy = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.copy(file, "TARGET_ID", null, { supportsAllDrives: true }),
  ).toBe(file);

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0]).toBe(file);
  expect(copy.mock.calls[0][1]).toBe("TARGET_ID");
  expect(copy.mock.calls[0][2]).toStrictEqual({ supportsAllDrives: true });
});

test("copy works with selective fields", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    mimeType: "text/plain",
  };

  const copy = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.copy(
      file,
      "TARGET_ID",
      { capabilities: { canMoveItemOutOfDrive: true }, mimeType: true },
      { supportsAllDrives: true },
    ),
  ).toBe(file);

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0]).toBe(file);
  expect(copy.mock.calls[0][1]).toBe("TARGET_ID");
  expect(copy.mock.calls[0][2]).toStrictEqual({
    fields: "capabilities(canMoveItemOutOfDrive), mimeType",
    supportsAllDrives: true,
  });
});

test("copy throws and error on invalid file", () => {
  const file = {
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const copy = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.copy(file, "TARGET_ID", null)).toThrow("");

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0]).toBe(file);
  expect(copy.mock.calls[0][1]).toBe("TARGET_ID");
  expect(copy.mock.calls[0][2]).toStrictEqual({});
});

test("get works", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const get = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          alt?: string;
          fields?: string;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      get,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.get("FILE_ID", null)).toBe(file);

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({});
});

test("get works with optional arguments", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const get = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          alt?: string;
          fields?: string;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      get,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.get("FILE_ID", null, { alt: "ALT" })).toBe(file);

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({ alt: "ALT" });
});

test("get works with selective fields", () => {
  const file = {
    id: "FILE_ID",
    title: "FILE_TITLE",
  };

  const get = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          alt?: string;
          fields?: string;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      get,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.get("FILE_ID", { id: true, title: true })).toBe(file);

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({ fields: "id, title" });
});

test("get throws an error on invalid file", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const get = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          alt?: string;
          fields?: string;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      get,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.get("FILE_ID", null)).toThrow("");

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({});
});

test("insert works", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.insert(file, null)).toBe(file);

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBe(undefined);
  expect(insert.mock.calls[0][2]).toStrictEqual({});
});

test("insert works with optional arguments", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.insert(file, null, undefined, { supportsAllDrives: true }),
  ).toBe(file);

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBe(undefined);
  expect(insert.mock.calls[0][2]).toStrictEqual({ supportsAllDrives: true });
});

test("insert works with selective fields", () => {
  const file = {
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.insert(file, {
      title: true,
      userPermission: { role: true },
    }),
  ).toBe(file);

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBe(undefined);
  expect(insert.mock.calls[0][2]).toStrictEqual({
    fields: "title, userPermission(role)",
  });
});

test("insert throws an error on invalid file", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {},
  };

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          fields?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.insert(file, null)).toThrow("");

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBe(undefined);
  expect(insert.mock.calls[0][2]).toStrictEqual({});
});

test("list works", () => {
  const fileList = {
    items: [
      {
        capabilities: {
          canMoveItemOutOfDrive: true,
        },
        id: "FILE1_ID",
        mimeType: "text/plain",
        title: "FILE1_TITLE",
        userPermission: {
          role: "reader" as const,
        },
      },
      {
        capabilities: {
          canMoveItemOutOfDrive: false,
        },
        id: "FILE2_ID",
        mimeType: "text/html",
        title: "FILE2_TITLE",
        userPermission: {
          role: "owner" as const,
        },
      },
    ],
  };

  const list = jest
    .fn<
      (optionalArgs?: {
        fields?: string;
        includeItemsFromAllDrives?: boolean;
        maxResults?: number;
        pageToken?: string;
        q?: string;
        supportsAllDrives?: boolean;
      }) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(fileList);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.list(null)).toBe(fileList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("list works with optional arguments", () => {
  const fileList = {
    items: [
      {
        capabilities: {
          canMoveItemOutOfDrive: true,
        },
        id: "FILE1_ID",
        mimeType: "text/plain",
        title: "FILE1_TITLE",
        userPermission: {
          role: "reader" as const,
        },
      },
      {
        capabilities: {
          canMoveItemOutOfDrive: false,
        },
        id: "FILE2_ID",
        mimeType: "text/html",
        title: "FILE2_TITLE",
        userPermission: {
          role: "owner" as const,
        },
      },
    ],
  };

  const list = jest
    .fn<
      (optionalArgs?: {
        fields?: string;
        includeItemsFromAllDrives?: boolean;
        maxResults?: number;
        pageToken?: string;
        q?: string;
        supportsAllDrives?: boolean;
      }) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(fileList);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  const optionalArgs = {
    includeItemsFromAllDrives: false,
    maxResults: 42,
    pageToken: undefined,
    q: "",
    supportsAllDrives: true,
  };

  expect(filesCollection.list(null, optionalArgs)).toBe(fileList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual(optionalArgs);
});

test("list works with selective fields", () => {
  const fileList = {
    items: [
      {
        capabilities: {
          canMoveItemOutOfDrive: true,
        },
        id: "FILE1_ID",
      },
      {
        capabilities: {
          canMoveItemOutOfDrive: false,
        },
        id: "FILE2_ID",
      },
    ],
  };

  const list = jest
    .fn<
      (optionalArgs?: {
        fields?: string;
        includeItemsFromAllDrives?: boolean;
        maxResults?: number;
        pageToken?: string;
        q?: string;
        supportsAllDrives?: boolean;
      }) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(fileList);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.list({
      capabilities: { canMoveItemOutOfDrive: true },
      id: true,
    }),
  ).toBe(fileList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({
    fields: "nextPageToken, items(capabilities(canMoveItemOutOfDrive), id)",
  });
});

test("list throws an error on invalid file", () => {
  const fileList = {
    items: [
      {
        capabilities: {
          canMoveItemOutOfDrive: true,
        },
        id: "FILE1_ID",
      },
      {
        capabilities: {
          canMoveItemOutOfDrive: false,
        },
        id: "FILE2_ID",
        mimeType: "text/html",
        title: "FILE2_TITLE",
        userPermission: {
          role: "owner" as const,
        },
      },
    ],
  };

  const list = jest
    .fn<
      (optionalArgs?: {
        fields?: string;
        includeItemsFromAllDrives?: boolean;
        maxResults?: number;
        pageToken?: string;
        q?: string;
        supportsAllDrives?: boolean;
      }) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(fileList);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.list(null)).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("list throws an error on invalid file list", () => {
  const fileList = {};

  const list = jest
    .fn<
      (optionalArgs?: {
        fields?: string;
        includeItemsFromAllDrives?: boolean;
        maxResults?: number;
        pageToken?: string;
        q?: string;
        supportsAllDrives?: boolean;
      }) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(fileList);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.list(null)).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("remove works", () => {
  const remove = jest.fn<(fileId: string) => void>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      remove,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  filesCollection.remove("FILE_ID");

  expect(remove.mock.calls).toHaveLength(1);
  expect(remove.mock.calls[0][0]).toBe("FILE_ID");
});

test("update works", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const update = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          addParents?: string;
          fields?: string;
          removeParents?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      update,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.update(file, "FILE_ID", null)).toBe(file);

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][0]).toBe(file);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBeUndefined();
  expect(update.mock.calls[0][3]).toStrictEqual({});
});

test("update works with optional arguments", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  const update = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          addParents?: string;
          fields?: string;
          removeParents?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      update,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  const optionalArgs = {
    addParents: "ADD_PARENT",
    removeParents: "REMOVE_PARENT",
    supportsAllDrives: true,
  };

  expect(
    filesCollection.update(file, "FILE_ID", null, undefined, optionalArgs),
  ).toBe(file);

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][0]).toBe(file);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBeUndefined();
  expect(update.mock.calls[0][3]).toStrictEqual(optionalArgs);
});

test("update works with selective fields", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
  };

  const update = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          addParents?: string;
          fields?: string;
          removeParents?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      update,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.update(file, "FILE_ID", {
      capabilities: { canMoveItemOutOfDrive: true },
    }),
  ).toBe(file);

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][0]).toBe(file);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBeUndefined();
  expect(update.mock.calls[0][3]).toStrictEqual({
    fields: "capabilities(canMoveItemOutOfDrive)",
  });
});

test("update throws an error on invalid file", () => {
  const file = {
    id: "FILE_ID",
  };

  const update = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
        mediaData?: any,
        optionalArgs?: {
          addParents?: string;
          fields?: string;
          removeParents?: string;
          supportsAllDrives?: boolean;
        },
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(file);
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      update,
    },
  };

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.update(file, "FILE_ID", null)).toThrow("");

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][0]).toBe(file);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBeUndefined();
  expect(update.mock.calls[0][3]).toStrictEqual({});
});
