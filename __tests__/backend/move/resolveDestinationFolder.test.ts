import { mocked } from "jest-mock";

import { mockedDrive, mockedFilesCollection } from "../../test-utils/mocked-gas";

import { resolveDestinationFolder_ } from "../../../src/backend/move/resolveDestinationFolder";

import { ErrorLogger_ } from "../../../src/backend/utils/ErrorLogger";
import * as folderManagement from "../../../src/backend/move/folderManagement";

jest.mock("../../../src/backend/utils/ErrorLogger");
jest.mock("../../../src/backend/move/folderManagement");

test("resolveDestinationFolder corretly creates new folder", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: InsertFileOptions
      ]
    >()
    .mockReturnValueOnce({
      id: "NEWLY_CREATED_FOLDER_ID",
      title: "FOLDER_NAME",
    });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };
  const logger = new ErrorLogger_();

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      "DEST_PARENT_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      logger
    )
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder"
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(logger).log.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set not to merge folders, even when a folder with the same name exists", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: InsertFileOptions
      ]
    >()
    .mockReturnValueOnce({
      id: "NEWLY_CREATED_FOLDER_ID",
      title: "FOLDER_NAME",
    });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    { id: "EXISTING_FOLDER_ID", title: "FOLDER_NAME" },
  ]);
  const logger = new ErrorLogger_();

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      "DEST_PARENT_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      logger
    )
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder"
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(logger).log.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set to merge folders, but there is no existing folder the same name", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: InsertFileOptions
      ]
    >()
    .mockReturnValueOnce({
      id: "NEWLY_CREATED_FOLDER_ID",
      title: "FOLDER_NAME",
    });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([]);
  const logger = new ErrorLogger_();

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      "DEST_PARENT_ID",
      ["PATH", "TO", "FOLDER"],
      true,
      logger
    )
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder"
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(logger).log.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly uses an existing folder when set to merge folders", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest.fn<
    GoogleAppsScript.Drive.Schema.File,
    [
      resource: GoogleAppsScript.Drive.Schema.File,
      mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      optionalArgs?: InsertFileOptions
    ]
  >();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    { id: "EXISTING_WRONG_FOLDER1_ID", title: "DIFFERENT_FOLDER_NAME1" },
    { id: "EXISTING_FOLDER_ID", title: "FOLDER_NAME" },
    { id: "EXISTING_WRONG_FOLDER2_ID", title: "DIFFERENT_FOLDER_NAME2" },
  ]);
  const logger = new ErrorLogger_();

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      "DEST_PARENT_ID",
      ["PATH", "TO", "FOLDER"],
      true,
      logger
    )
  ).toStrictEqual({ id: "EXISTING_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(0);
  expect(mocked(logger).log.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder fails gracefully on multiple existing folders with the same name", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: InsertFileOptions
      ]
    >()
    .mockReturnValueOnce({
      id: "NEWLY_CREATED_FOLDER_ID",
      title: "FOLDER_NAME",
    });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      insert,
    },
  };

  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    { id: "EXISTING_WRONG_FOLDER1_ID", title: "DIFFERENT_FOLDER_NAME1" },
    { id: "EXISTING_FOLDER_ID1", title: "FOLDER_NAME" },
    { id: "EXISTING_FOLDER_ID2", title: "FOLDER_NAME" },
    { id: "EXISTING_WRONG_FOLDER2_ID", title: "DIFFERENT_FOLDER_NAME2" },
  ]);
  const logger = new ErrorLogger_();

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      "DEST_PARENT_ID",
      ["PATH", "TO", "FOLDER"],
      true,
      logger
    )
  ).toStrictEqual({
    id: "NEWLY_CREATED_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder"
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]).not.toBeUndefined();
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(logger).log.mock.calls).toHaveLength(1);
  expect(mocked(logger).log.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "FOLDER_NAME",
  ]);
  expect(mocked(logger).log.mock.calls[0][1]).not.toBe("");
});
