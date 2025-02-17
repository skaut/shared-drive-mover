import { expect, test, vi } from "vitest";

import { SafeFilesCollection_ } from "../../../../src/backend/utils/SafeDriveService/SafeFilesCollection";
import { mockedDrive } from "../../test-utils/gas-stubs";

test("copy works", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

  expect(SafeFilesCollection_.copy(file, "TARGET_ID", null)).toBe(file);

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0]).toBe(file);
  expect(copy.mock.calls[0][1]).toBe("TARGET_ID");
  expect(copy.mock.calls[0][2]).toStrictEqual({});
});

test("copy works with optional arguments", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

  expect(
    SafeFilesCollection_.copy(file, "TARGET_ID", null, {
      supportsAllDrives: true,
    }),
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

  global.Drive = mockedDrive();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

  expect(
    SafeFilesCollection_.copy(
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
    capabilities: {
      canDelete: false,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const copy = vi.mocked(global.Drive.Files).copy.mockReturnValueOnce(file);

  expect(() => SafeFilesCollection_.copy(file, "TARGET_ID", null)).toThrow(
    "Files.copy: File is not safe.",
  );

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0]).toBe(file);
  expect(copy.mock.calls[0][1]).toBe("TARGET_ID");
  expect(copy.mock.calls[0][2]).toStrictEqual({});
});

test("get works", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

  expect(SafeFilesCollection_.get("FILE_ID", null)).toBe(file);

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({});
});

test("get works with optional arguments", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

  expect(SafeFilesCollection_.get("FILE_ID", null, { alt: "ALT" })).toBe(file);

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({ alt: "ALT" });
});

test("get works with selective fields", () => {
  const file = {
    id: "FILE_ID",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

  expect(SafeFilesCollection_.get("FILE_ID", { id: true, name: true })).toBe(
    file,
  );

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({ fields: "id, name" });
});

test("get throws an error on invalid file", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const get = vi.mocked(global.Drive.Files).get.mockReturnValueOnce(file);

  expect(() => SafeFilesCollection_.get("FILE_ID", null)).toThrow(
    "Files.get: File is not safe.",
  );

  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toStrictEqual({});
});

test("create works", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const create = vi.mocked(global.Drive.Files).create.mockReturnValueOnce(file);

  expect(SafeFilesCollection_.create(file, null)).toBe(file);

  expect(create.mock.calls).toHaveLength(1);
  expect(create.mock.calls[0][0]).toBe(file);
  expect(create.mock.calls[0][1]).toBeUndefined();
  expect(create.mock.calls[0][2]).toStrictEqual({});
});

test("create works with optional arguments", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const create = vi.mocked(global.Drive.Files).create.mockReturnValueOnce(file);

  expect(
    SafeFilesCollection_.create(file, null, undefined, {
      supportsAllDrives: true,
    }),
  ).toBe(file);

  expect(create.mock.calls).toHaveLength(1);
  expect(create.mock.calls[0][0]).toBe(file);
  expect(create.mock.calls[0][1]).toBeUndefined();
  expect(create.mock.calls[0][2]).toStrictEqual({ supportsAllDrives: true });
});

test("create works with selective fields", () => {
  const file = {
    capabilities: {
      canDelete: false,
    },
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const create = vi.mocked(global.Drive.Files).create.mockReturnValueOnce(file);

  expect(
    SafeFilesCollection_.create(file, {
      capabilities: { canDelete: true },
      name: true,
    }),
  ).toBe(file);

  expect(create.mock.calls).toHaveLength(1);
  expect(create.mock.calls[0][0]).toBe(file);
  expect(create.mock.calls[0][1]).toBeUndefined();
  expect(create.mock.calls[0][2]).toStrictEqual({
    fields: "capabilities(canDelete), name",
  });
});

test("create throws an error on invalid file", () => {
  const file = {
    capabilities: {
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const create = vi.mocked(global.Drive.Files).create.mockReturnValueOnce(file);

  expect(() => SafeFilesCollection_.create(file, null)).toThrow(
    "Files.create: File is not safe.",
  );

  expect(create.mock.calls).toHaveLength(1);
  expect(create.mock.calls[0][0]).toBe(file);
  expect(create.mock.calls[0][1]).toBeUndefined();
  expect(create.mock.calls[0][2]).toStrictEqual({});
});

test("list works", () => {
  const fileList = {
    files: [
      {
        capabilities: {
          canDelete: false,
          canMoveItemOutOfDrive: true,
        },
        id: "FILE1_ID",
        mimeType: "text/plain",
        name: "FILE1_TITLE",
      },
      {
        capabilities: {
          canDelete: true,
          canMoveItemOutOfDrive: false,
        },
        id: "FILE2_ID",
        mimeType: "text/html",
        name: "FILE2_TITLE",
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

  expect(SafeFilesCollection_.list(null)).toBe(fileList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("list works with optional arguments", () => {
  const fileList = {
    files: [
      {
        capabilities: {
          canDelete: false,
          canMoveItemOutOfDrive: true,
        },
        id: "FILE1_ID",
        mimeType: "text/plain",
        name: "FILE1_TITLE",
      },
      {
        capabilities: {
          canDelete: true,
          canMoveItemOutOfDrive: false,
        },
        id: "FILE2_ID",
        mimeType: "text/html",
        name: "FILE2_TITLE",
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

  const optionalArgs = {
    includeItemsFromAllDrives: false,
    maxResults: 42,
    pageToken: undefined,
    q: "",
    supportsAllDrives: true,
  };

  expect(SafeFilesCollection_.list(null, optionalArgs)).toBe(fileList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual(optionalArgs);
});

test("list works with selective fields", () => {
  const fileList = {
    files: [
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

  global.Drive = mockedDrive();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

  expect(
    SafeFilesCollection_.list({
      capabilities: { canMoveItemOutOfDrive: true },
      id: true,
    }),
  ).toBe(fileList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({
    fields: "nextPageToken, files(capabilities(canMoveItemOutOfDrive), id)",
  });
});

test("list throws an error on invalid file", () => {
  const fileList = {
    files: [
      {
        capabilities: {
          canMoveItemOutOfDrive: true,
        },
        id: "FILE1_ID",
      },
      {
        capabilities: {
          canDelete: true,
          canMoveItemOutOfDrive: false,
        },
        id: "FILE2_ID",
        mimeType: "text/html",
        name: "FILE2_TITLE",
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

  expect(() => SafeFilesCollection_.list(null)).toThrow(
    "Files.list: File list is not safe.",
  );

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("list throws an error on invalid file list", () => {
  const fileList = {};

  global.Drive = mockedDrive();
  const list = vi.mocked(global.Drive.Files).list.mockReturnValueOnce(fileList);

  expect(() => SafeFilesCollection_.list(null)).toThrow(
    "Files.list: File list is not safe.",
  );

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("remove works", () => {
  global.Drive = mockedDrive();
  const remove = vi.mocked(global.Drive.Files).remove.mockImplementationOnce(
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- Implementation needed so the function is bound to local this
    () => {},
  );

  SafeFilesCollection_.remove("FILE_ID");

  expect(remove.mock.calls).toHaveLength(1);
  expect(remove.mock.calls[0][0]).toBe("FILE_ID");
});

test("update works", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

  expect(SafeFilesCollection_.update(file, "FILE_ID", null)).toBe(file);

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][0]).toBe(file);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBeUndefined();
  expect(update.mock.calls[0][3]).toStrictEqual({});
});

test("update works with optional arguments", () => {
  const file = {
    capabilities: {
      canDelete: false,
      canMoveItemOutOfDrive: true,
    },
    id: "FILE_ID",
    mimeType: "text/plain",
    name: "FILE_TITLE",
  };

  global.Drive = mockedDrive();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

  const optionalArgs = {
    addParents: "ADD_PARENT",
    removeParents: "REMOVE_PARENT",
    supportsAllDrives: true,
  };

  expect(
    SafeFilesCollection_.update(file, "FILE_ID", null, undefined, optionalArgs),
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

  global.Drive = mockedDrive();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

  expect(
    SafeFilesCollection_.update(file, "FILE_ID", {
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

  global.Drive = mockedDrive();
  const update = vi.mocked(global.Drive.Files).update.mockReturnValueOnce(file);

  expect(() => SafeFilesCollection_.update(file, "FILE_ID", null)).toThrow(
    "Files.update: File is not safe.",
  );

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][0]).toBe(file);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBeUndefined();
  expect(update.mock.calls[0][3]).toStrictEqual({});
});
