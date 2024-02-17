import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import * as folderManagement from "../../../src/backend/move/folderManagement";
import { resolveDestinationFolder_ } from "../../../src/backend/move/resolveDestinationFolder";
import { MoveState_ } from "../../../src/backend/utils/MoveState";
import { mockedDrive, mockedFilesCollection } from "../../test-utils/gas-stubs";

jest.mock("../../../src/backend/utils/MoveState");
jest.mock("../../../src/backend/move/folderManagement");

test("resolveDestinationFolder corretly creates new folder", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
        mediaData?: any,
        optionalArgs?: InsertFileOptions,
      ) => GoogleAppsScript.Drive.Schema.File
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
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        sourceID: "SRC_PARENT_ID",
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
      },
      false,
    ),
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]).toBeDefined();
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set not to merge folders, even when a folder with the same name exists", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
        mediaData?: any,
        optionalArgs?: InsertFileOptions,
      ) => GoogleAppsScript.Drive.Schema.File
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
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        sourceID: "SRC_PARENT_ID",
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
      },
      false,
    ),
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]).toBeDefined();
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set to merge folders, but there is no existing folder the same name", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
        mediaData?: any,
        optionalArgs?: InsertFileOptions,
      ) => GoogleAppsScript.Drive.Schema.File
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
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, true);

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        sourceID: "SRC_PARENT_ID",
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
      },
      true,
    ),
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]).toBeDefined();
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly uses an existing folder when set to merge folders", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest.fn<
    (
      resource: GoogleAppsScript.Drive.Schema.File,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
      mediaData?: any,
      optionalArgs?: InsertFileOptions,
    ) => GoogleAppsScript.Drive.Schema.File
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
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, true);

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        sourceID: "SRC_PARENT_ID",
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
      },
      true,
    ),
  ).toStrictEqual({ id: "EXISTING_FOLDER_ID", title: "FOLDER_NAME" });

  expect(insert.mock.calls).toHaveLength(0);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder fails gracefully on multiple existing folders with the same name", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
        mediaData?: any,
        optionalArgs?: InsertFileOptions,
      ) => GoogleAppsScript.Drive.Schema.File
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
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, true);

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        sourceID: "SRC_PARENT_ID",
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
      },
      true,
    ),
  ).toStrictEqual({
    id: "NEWLY_CREATED_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2]).toBeDefined();
  expect(insert.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(1);
  expect(mocked(state).logError.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "FOLDER_NAME",
  ]);
  expect(mocked(state).logError.mock.calls[0][1]).not.toBe("");
});
