import { isFolderEmpty } from "../../../src/backend/move/isFolderEmpty";

test("isFolderEmpty works correctly with an empty folder", () => {
  interface File {
    id?: string;
  }
  interface FileList {
    items?: Array<File>;
  }
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
    .fn<FileList, [optionalArgs: ListFilesOptions]>()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    Files: {
      list,
    },
  };

  expect(isFolderEmpty("ID_FOLDER")).toBe(true);
  expect(list.mock.calls.length).toBe(1);
  expect(list.mock.calls[0][0].q).toContain("ID_FOLDER");
  expect(list.mock.calls[0][0].includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0].supportsAllDrives).toBe(true);
});

test("isFolderEmpty works correctly with a non-empty folder", () => {
  interface File {
    id?: string;
  }
  interface FileList {
    items?: Array<File>;
  }
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
    .fn<FileList, [optionalArgs: ListFilesOptions]>()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    Files: {
      list,
    },
  };

  expect(isFolderEmpty("ID_FOLDER")).toBe(false);
  expect(list.mock.calls.length).toBe(1);
  expect(list.mock.calls[0][0].q).toContain("ID_FOLDER");
  expect(list.mock.calls[0][0].includeItemsFromAllDrives).toBe(true);
  expect(list.mock.calls[0][0].supportsAllDrives).toBe(true);
});
