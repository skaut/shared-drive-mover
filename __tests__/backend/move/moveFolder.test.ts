import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import * as folderManagement from "../../../src/backend/move/folderManagement";
import * as moveFile from "../../../src/backend/move/moveFile";
import { moveFolder_ } from "../../../src/backend/move/moveFolder";
import * as resolveDestinationFolder from "../../../src/backend/move/resolveDestinationFolder";
import { MoveState_ } from "../../../src/backend/utils/MoveState";

jest.mock("../../../src/backend/move/folderManagement");
jest.mock("../../../src/backend/move/moveFile");
jest.mock("../../../src/backend/move/resolveDestinationFolder");
jest.mock("../../../src/backend/utils/MoveState");

test("moveFolder works correctly with an empty folder", () => {
  const listFilesInFolder = mocked(
    folderManagement,
  ).listFilesInFolder_.mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(
    folderManagement,
  ).listFoldersInFolder_.mockReturnValueOnce([]);
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };

  moveFolder_(state, context, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(state).addPath.mock.calls).toHaveLength(0);
  expect(mocked(state).removePath.mock.calls).toHaveLength(1);
  expect(mocked(state).removePath.mock.calls[0][0]).toBe(context);
  expect(mocked(state).saveState.mock.calls).toHaveLength(1);
});

test("moveFolder moves files correctly", () => {
  const listFilesInFolder = mocked(
    folderManagement,
  ).listFilesInFolder_.mockReturnValueOnce([
    { id: "FILE1_ID" },
    { id: "FILE2_ID" },
  ]);
  const listFoldersInFolder = mocked(
    folderManagement,
  ).listFoldersInFolder_.mockReturnValueOnce([]);
  const moveFileFn = mocked(moveFile)
    .moveFile_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  moveFolder_(state, context, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls).toHaveLength(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(state);
  expect(moveFileFn.mock.calls[0][2]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[0][3]).toBe(false);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1]).toStrictEqual(state);
  expect(moveFileFn.mock.calls[1][2]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[1][3]).toBe(false);
  expect(mocked(state).addPath.mock.calls).toHaveLength(0);
  expect(mocked(state).removePath.mock.calls).toHaveLength(1);
  expect(mocked(state).removePath.mock.calls[0][0]).toBe(context);
  expect(mocked(state).saveState.mock.calls).toHaveLength(1);
});

test("moveFolder adds subfolders to the state correctly", () => {
  const listFilesInFolder = mocked(
    folderManagement,
  ).listFilesInFolder_.mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(
    folderManagement,
  ).listFoldersInFolder_.mockReturnValueOnce([
    { id: "SRC_SUBFOLDER1_ID", title: "SUBFOLDER1_NAME" },
    { id: "SRC_SUBFOLDER2_ID", title: "SUBFOLDER2_NAME" },
  ]);
  const resolveDestinationFolderFn = mocked(resolveDestinationFolder)
    .resolveDestinationFolder_.mockReturnValueOnce({ id: "DEST_SUBFOLDER1_ID" })
    .mockReturnValueOnce({ id: "DEST_SUBFOLDER2_ID" });
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  moveFolder_(state, context, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls).toHaveLength(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe(
    "SRC_SUBFOLDER1_ID",
  );
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toStrictEqual(state);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe(
    "SRC_SUBFOLDER2_ID",
  );
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toStrictEqual(state);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(false);
  expect(mocked(state).addPath.mock.calls).toHaveLength(2);
  expect(mocked(state).addPath.mock.calls[0][0]).toBe("SRC_SUBFOLDER1_ID");
  expect(mocked(state).addPath.mock.calls[0][1]).toBe("DEST_SUBFOLDER1_ID");
  expect(mocked(state).addPath.mock.calls[0][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER1_NAME",
  ]);
  expect(mocked(state).addPath.mock.calls[1][0]).toBe("SRC_SUBFOLDER2_ID");
  expect(mocked(state).addPath.mock.calls[1][1]).toBe("DEST_SUBFOLDER2_ID");
  expect(mocked(state).addPath.mock.calls[1][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER2_NAME",
  ]);
  expect(mocked(state).removePath.mock.calls).toHaveLength(1);
  expect(mocked(state).removePath.mock.calls[0][0]).toBe(context);
  expect(mocked(state).saveState.mock.calls).toHaveLength(1);
});

test("moveFolder moves files correctly, even when listing folders throws", () => {
  expect.assertions(18);
  const listFilesInFolder = mocked(
    folderManagement,
  ).listFilesInFolder_.mockReturnValueOnce([
    { id: "FILE1_ID" },
    { id: "FILE2_ID" },
  ]);
  const listFoldersInFolder = mocked(
    folderManagement,
  ).listFoldersInFolder_.mockImplementationOnce(() => {
    throw new Error("ERROR_MESSAGE");
  });
  const moveFileFn = mocked(moveFile)
    .moveFile_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state)
    .tryOrLog.mockImplementationOnce((_, fn) => fn())
    .mockImplementationOnce((_, fn) => {
      expect(fn).toThrow("ERROR_MESSAGE");
      return null;
    });

  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  moveFolder_(state, context, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls).toHaveLength(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(state);
  expect(moveFileFn.mock.calls[0][2]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[0][3]).toBe(false);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1]).toStrictEqual(state);
  expect(moveFileFn.mock.calls[1][2]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[1][3]).toBe(false);
  expect(mocked(state).addPath.mock.calls).toHaveLength(0);
  expect(mocked(state).removePath.mock.calls).toHaveLength(1);
  expect(mocked(state).removePath.mock.calls[0][0]).toBe(context);
  expect(mocked(state).saveState.mock.calls).toHaveLength(1);
});

test("moveFolder adds subfolders to the state correctly, even when listing files throws", () => {
  expect.assertions(24);
  const listFilesInFolder = mocked(
    folderManagement,
  ).listFilesInFolder_.mockImplementationOnce(() => {
    throw new Error("ERROR_MESSAGE");
  });
  const listFoldersInFolder = mocked(
    folderManagement,
  ).listFoldersInFolder_.mockReturnValueOnce([
    { id: "SRC_SUBFOLDER1_ID", title: "SUBFOLDER1_NAME" },
    { id: "SRC_SUBFOLDER2_ID", title: "SUBFOLDER2_NAME" },
  ]);
  const resolveDestinationFolderFn = mocked(resolveDestinationFolder)
    .resolveDestinationFolder_.mockReturnValueOnce({ id: "DEST_SUBFOLDER1_ID" })
    .mockReturnValueOnce({ id: "DEST_SUBFOLDER2_ID" });
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state)
    .tryOrLog.mockImplementationOnce((_, fn) => {
      expect(fn).toThrow("ERROR_MESSAGE");
      return null;
    })
    .mockImplementationOnce((_, fn) => fn());

  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };

  moveFolder_(state, context, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls).toHaveLength(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe(
    "SRC_SUBFOLDER1_ID",
  );
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toStrictEqual(state);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe(
    "SRC_SUBFOLDER2_ID",
  );
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toStrictEqual(state);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(false);
  expect(mocked(state).addPath.mock.calls).toHaveLength(2);
  expect(mocked(state).addPath.mock.calls[0][0]).toBe("SRC_SUBFOLDER1_ID");
  expect(mocked(state).addPath.mock.calls[0][1]).toBe("DEST_SUBFOLDER1_ID");
  expect(mocked(state).addPath.mock.calls[0][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER1_NAME",
  ]);
  expect(mocked(state).addPath.mock.calls[1][0]).toBe("SRC_SUBFOLDER2_ID");
  expect(mocked(state).addPath.mock.calls[1][1]).toBe("DEST_SUBFOLDER2_ID");
  expect(mocked(state).addPath.mock.calls[1][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER2_NAME",
  ]);
  expect(mocked(state).removePath.mock.calls).toHaveLength(1);
  expect(mocked(state).removePath.mock.calls[0][0]).toBe(context);
  expect(mocked(state).saveState.mock.calls).toHaveLength(1);
});

test("moveFolder passes copyComments correctly", () => {
  const listFilesInFolder = mocked(
    folderManagement,
  ).listFilesInFolder_.mockReturnValueOnce([
    { id: "FILE1_ID" },
    { id: "FILE2_ID" },
  ]);
  const listFoldersInFolder = mocked(
    folderManagement,
  ).listFoldersInFolder_.mockReturnValueOnce([]);
  const moveFileFn = mocked(moveFile)
    .moveFile_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };

  moveFolder_(state, context, true, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls).toHaveLength(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(state);
  expect(moveFileFn.mock.calls[0][2]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[0][3]).toBe(true);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1]).toStrictEqual(state);
  expect(moveFileFn.mock.calls[1][2]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[1][3]).toBe(true);
  expect(mocked(state).addPath.mock.calls).toHaveLength(0);
  expect(mocked(state).removePath.mock.calls).toHaveLength(1);
  expect(mocked(state).removePath.mock.calls[0][0]).toBe(context);
  expect(mocked(state).saveState.mock.calls).toHaveLength(1);
});

test("moveFolder passes mergeFolders correctly", () => {
  const listFilesInFolder = mocked(
    folderManagement,
  ).listFilesInFolder_.mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(
    folderManagement,
  ).listFoldersInFolder_.mockReturnValueOnce([
    { id: "SRC_SUBFOLDER1_ID", title: "SUBFOLDER1_NAME" },
    { id: "SRC_SUBFOLDER2_ID", title: "SUBFOLDER2_NAME" },
  ]);
  const resolveDestinationFolderFn = mocked(resolveDestinationFolder)
    .resolveDestinationFolder_.mockReturnValueOnce({ id: "DEST_SUBFOLDER1_ID" })
    .mockReturnValueOnce({ id: "DEST_SUBFOLDER2_ID" });
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };

  moveFolder_(state, context, false, true);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls).toHaveLength(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe(
    "SRC_SUBFOLDER1_ID",
  );
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toStrictEqual(state);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(true);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe(
    "SRC_SUBFOLDER2_ID",
  );
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toStrictEqual(state);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(true);
  expect(mocked(state).addPath.mock.calls).toHaveLength(2);
  expect(mocked(state).addPath.mock.calls[0][0]).toBe("SRC_SUBFOLDER1_ID");
  expect(mocked(state).addPath.mock.calls[0][1]).toBe("DEST_SUBFOLDER1_ID");
  expect(mocked(state).addPath.mock.calls[0][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER1_NAME",
  ]);
  expect(mocked(state).addPath.mock.calls[1][0]).toBe("SRC_SUBFOLDER2_ID");
  expect(mocked(state).addPath.mock.calls[1][1]).toBe("DEST_SUBFOLDER2_ID");
  expect(mocked(state).addPath.mock.calls[1][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER2_NAME",
  ]);
  expect(mocked(state).removePath.mock.calls).toHaveLength(1);
  expect(mocked(state).removePath.mock.calls[0][0]).toBe(context);
  expect(mocked(state).saveState.mock.calls).toHaveLength(1);
});
