import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import * as folderManagement from "../../../src/backend/move/folderManagement";
import { resolveDestinationFolder_ } from "../../../src/backend/move/resolveDestinationFolder";
import { MoveState_ } from "../../../src/backend/utils/MoveState";
import { mockedDriveService } from "../../test-utils/DriveService-stub";

jest.mock("../../../src/backend/utils/MoveState");
jest.mock("../../../src/backend/move/folderManagement");

test("resolveDestinationFolder corretly creates new folder", () => {
  interface InsertFileOptions {
    fields?: string;
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.insert.mockReturnValueOnce({
    id: "NEWLY_CREATED_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
        sourceID: "SRC_PARENT_ID",
      },
      false,
      driveServiceMock,
    ),
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][2]).toBeDefined();
  expect(
    (driveServiceMock.Files.insert.mock.calls[0][2] as InsertFileOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set not to merge folders, even when a folder with the same name exists", () => {
  interface InsertFileOptions {
    fields?: string;
    supportsAllDrives?: boolean;
  }

  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    { id: "EXISTING_FOLDER_ID", title: "FOLDER_NAME" },
  ]);
  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.insert.mockReturnValueOnce({
    id: "NEWLY_CREATED_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
        sourceID: "SRC_PARENT_ID",
      },
      false,
      driveServiceMock,
    ),
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][2]).toBeDefined();
  expect(
    (driveServiceMock.Files.insert.mock.calls[0][2] as InsertFileOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set to merge folders, but there is no existing folder the same name", () => {
  interface InsertFileOptions {
    fields?: string;
    supportsAllDrives?: boolean;
  }

  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([]);
  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.insert.mockReturnValueOnce({
    id: "NEWLY_CREATED_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    true,
    driveServiceMock,
  );

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
        sourceID: "SRC_PARENT_ID",
      },
      true,
      driveServiceMock,
    ),
  ).toStrictEqual({ id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" });

  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][2]).toBeDefined();
  expect(
    (driveServiceMock.Files.insert.mock.calls[0][2] as InsertFileOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly uses an existing folder when set to merge folders", () => {
  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    { id: "EXISTING_WRONG_FOLDER1_ID", title: "DIFFERENT_FOLDER_NAME1" },
    { id: "EXISTING_FOLDER_ID", title: "FOLDER_NAME" },
    { id: "EXISTING_WRONG_FOLDER2_ID", title: "DIFFERENT_FOLDER_NAME2" },
  ]);
  const driveServiceMock = mockedDriveService();

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    true,
    driveServiceMock,
  );

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
        sourceID: "SRC_PARENT_ID",
      },
      true,
      driveServiceMock,
    ),
  ).toStrictEqual({ id: "EXISTING_FOLDER_ID", title: "FOLDER_NAME" });

  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(0);
  expect(mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder fails gracefully on multiple existing folders with the same name", () => {
  interface InsertFileOptions {
    fields?: string;
    supportsAllDrives?: boolean;
  }

  mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    { id: "EXISTING_WRONG_FOLDER1_ID", title: "DIFFERENT_FOLDER_NAME1" },
    { id: "EXISTING_FOLDER_ID1", title: "FOLDER_NAME" },
    { id: "EXISTING_FOLDER_ID2", title: "FOLDER_NAME" },
    { id: "EXISTING_WRONG_FOLDER2_ID", title: "DIFFERENT_FOLDER_NAME2" },
  ]);
  const driveServiceMock = mockedDriveService();
  driveServiceMock.Files.insert.mockReturnValueOnce({
    id: "NEWLY_CREATED_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    true,
    driveServiceMock,
  );

  expect(
    resolveDestinationFolder_(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      state,
      {
        destinationID: "DEST_PARENT_ID",
        path: ["PATH", "TO", "FOLDER"],
        sourceID: "SRC_PARENT_ID",
      },
      true,
      driveServiceMock,
    ),
  ).toStrictEqual({
    id: "NEWLY_CREATED_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][2]).toBeDefined();
  expect(
    (driveServiceMock.Files.insert.mock.calls[0][2] as InsertFileOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(mocked(state).logError.mock.calls).toHaveLength(1);
  expect(mocked(state).logError.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "FOLDER_NAME",
  ]);
  expect(mocked(state).logError.mock.calls[0][1]).not.toBe("");
});
