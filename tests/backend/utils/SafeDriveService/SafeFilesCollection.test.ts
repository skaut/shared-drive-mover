import { expect, test, vi } from "vitest";

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

  global.Drive.Files = mockedFilesCollection();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const insert = vi.mocked(global.Drive.Files).insert.mockReturnValueOnce(file);

  const filesCollection = new SafeFilesCollection_();

  expect(filesCollection.insert(file, null)).toBe(file);

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBeUndefined();
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

  global.Drive.Files = mockedFilesCollection();
  const insert = vi.mocked(global.Drive.Files).insert.mockReturnValueOnce(file);

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.insert(file, null, undefined, { supportsAllDrives: true }),
  ).toBe(file);

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBeUndefined();
  expect(insert.mock.calls[0][2]).toStrictEqual({ supportsAllDrives: true });
});

test("insert works with selective fields", () => {
  const file = {
    title: "FILE_TITLE",
    userPermission: {
      role: "reader" as const,
    },
  };

  global.Drive.Files = mockedFilesCollection();
  const insert = vi.mocked(global.Drive.Files).insert.mockReturnValueOnce(file);

  const filesCollection = new SafeFilesCollection_();

  expect(
    filesCollection.insert(file, {
      title: true,
      userPermission: { role: true },
    }),
  ).toBe(file);

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBeUndefined();
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

  global.Drive.Files = mockedFilesCollection();
  const insert = vi.mocked(global.Drive.Files).insert.mockReturnValueOnce(file);

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.insert(file, null)).toThrow("");

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(file);
  expect(insert.mock.calls[0][1]).toBeUndefined();
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

  global.Drive.Files = mockedFilesCollection();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

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

  global.Drive.Files = mockedFilesCollection();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

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

  global.Drive.Files = mockedFilesCollection();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

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

  global.Drive.Files = mockedFilesCollection();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.list(null)).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("list throws an error on invalid file list", () => {
  const fileList = {};

  global.Drive.Files = mockedFilesCollection();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.list(null)).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("remove works", () => {
  global.Drive.Files = mockedFilesCollection();
  const remove = vi.mocked(global.Drive.Files).remove.mockImplementationOnce(
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- Implementation needed so the function is bound to local this
    () => {},
  );

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

  global.Drive.Files = mockedFilesCollection();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

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

  global.Drive.Files = mockedFilesCollection();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

  const filesCollection = new SafeFilesCollection_();

  expect(() => filesCollection.update(file, "FILE_ID", null)).toThrow("");

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][0]).toBe(file);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBeUndefined();
  expect(update.mock.calls[0][3]).toStrictEqual({});
});
