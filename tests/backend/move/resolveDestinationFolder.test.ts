import { expect, test, vi } from "vitest";

import * as folderManagement from "../../../src/backend/move/folderManagement";
import { resolveDestinationFolder_ } from "../../../src/backend/move/resolveDestinationFolder";
import { MoveState_ } from "../../../src/backend/utils/MoveState";
import { mockedSafeDriveService } from "../test-utils/SafeDriveService-stub";

vi.mock("../../../src/backend/utils/MoveState");
vi.mock("../../../src/backend/move/folderManagement");

test("resolveDestinationFolder corretly creates new folder", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.insert).mockReturnValueOnce({
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
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FOLDER_ID",
        title: "FOLDER_NAME",
      },
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

  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].mimeType,
  ).toBe("application/vnd.google-apps.folder");
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].parents,
  ).toStrictEqual([{ id: "DEST_PARENT_ID" }]);
  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][3],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.insert).mock
        .calls[0][3] as InsertFileOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(vi.mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set not to merge folders, even when a folder with the same name exists", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
  }

  vi.mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_FOLDER_ID",
      title: "FOLDER_NAME",
    },
  ]);
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.insert).mockReturnValueOnce({
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
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FOLDER_ID",
        title: "FOLDER_NAME",
      },
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

  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].mimeType,
  ).toBe("application/vnd.google-apps.folder");
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].parents,
  ).toStrictEqual([{ id: "DEST_PARENT_ID" }]);
  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][3],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.insert).mock
        .calls[0][3] as InsertFileOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(vi.mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly creates new folder when set to merge folders, but there is no existing folder the same name", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
  }

  vi.mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([]);
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.insert).mockReturnValueOnce({
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
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FOLDER_ID",
        title: "FOLDER_NAME",
      },
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

  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].mimeType,
  ).toBe("application/vnd.google-apps.folder");
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].parents,
  ).toStrictEqual([{ id: "DEST_PARENT_ID" }]);
  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][3],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.insert).mock
        .calls[0][3] as InsertFileOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(vi.mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder corretly uses an existing folder when set to merge folders", () => {
  vi.mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_WRONG_FOLDER1_ID",
      title: "DIFFERENT_FOLDER_NAME1",
    },
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_FOLDER_ID",
      title: "FOLDER_NAME",
    },
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_WRONG_FOLDER2_ID",
      title: "DIFFERENT_FOLDER_NAME2",
    },
  ]);
  const driveServiceMock = mockedSafeDriveService();

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    true,
    driveServiceMock,
  );

  expect(
    resolveDestinationFolder_(
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FOLDER_ID",
        title: "FOLDER_NAME",
      },
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
    capabilities: { canMoveItemOutOfDrive: true },
    id: "EXISTING_FOLDER_ID",
    title: "FOLDER_NAME",
  });

  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls).toHaveLength(0);
  expect(vi.mocked(state).logError.mock.calls).toHaveLength(0);
});

test("resolveDestinationFolder fails gracefully on multiple existing folders with the same name", () => {
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
  }

  vi.mocked(folderManagement).listFoldersInFolder_.mockReturnValueOnce([
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_WRONG_FOLDER1_ID",
      title: "DIFFERENT_FOLDER_NAME1",
    },
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_FOLDER_ID1",
      title: "FOLDER_NAME",
    },
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_FOLDER_ID2",
      title: "FOLDER_NAME",
    },
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "EXISTING_WRONG_FOLDER2_ID",
      title: "DIFFERENT_FOLDER_NAME2",
    },
  ]);
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.insert).mockReturnValueOnce({
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
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FOLDER_ID",
        title: "FOLDER_NAME",
      },
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

  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].mimeType,
  ).toBe("application/vnd.google-apps.folder");
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].parents,
  ).toStrictEqual([{ id: "DEST_PARENT_ID" }]);
  expect(vi.mocked(driveServiceMock.Files.insert).mock.calls[0][0].title).toBe(
    "FOLDER_NAME",
  );
  expect(
    vi.mocked(driveServiceMock.Files.insert).mock.calls[0][3],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.insert).mock
        .calls[0][3] as InsertFileOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(vi.mocked(state).logError.mock.calls).toHaveLength(1);
  expect(vi.mocked(state).logError.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "FOLDER_NAME",
  ]);
  expect(vi.mocked(state).logError.mock.calls[0][1]).not.toBe("");
});
