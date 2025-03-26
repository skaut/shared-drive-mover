import { expect, test, vi } from "vitest";

import { move } from "../../src/backend/move";
import * as folderManagement from "../../src/backend/move/folderManagement";
import * as moveFolder from "../../src/backend/move/moveFolder";
import { MoveState_ } from "../../src/backend/utils/MoveState";
import { SafeDriveService_ } from "../../src/backend/utils/SafeDriveService";
import { mockedMoveState } from "./test-utils/MoveState-stub";

vi.mock("../../src/backend/move/folderManagement");
vi.mock("../../src/backend/move/moveFolder");
vi.mock("../../src/backend/utils/SafeDriveService");
vi.mock("../../src/backend/utils/MoveState");

test("move works correctly", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockReturnValueOnce({
      destinationID: "DEST_ID",
      path: [],
      sourceID: "SRC_ID",
    })
    .mockReturnValue(null);
  moveStateMock.getErrors.mockReturnValueOnce([]);
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move works correctly with subfolders", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockReturnValueOnce({
      destinationID: "DEST_ID",
      path: [],
      sourceID: "SRC_ID",
    })
    .mockReturnValueOnce({
      destinationID: "SUB1_DEST_ID",
      path: ["SUBFOLDER1"],
      sourceID: "SUB1_SRC_ID",
    })
    .mockReturnValueOnce({
      destinationID: "SUB2_DEST_ID",
      path: ["SUBFOLDER2"],
      sourceID: "SUB2_SRC_ID",
    })
    .mockReturnValueOnce({
      destinationID: "SUB3_DEST_ID",
      path: ["PATH", "TO", "SOME", "DEEP", "SUBFOLDER3"],
      sourceID: "SUB3_SRC_ID",
    })
    .mockReturnValue(null);
  moveStateMock.getErrors.mockReturnValueOnce([]);
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(5);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(4);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[1][1].sourceID).toBe(
    "SUB1_SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[1][1].destinationID).toBe(
    "SUB1_DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[1][1].path).toStrictEqual(
    ["SUBFOLDER1"],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[1][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[1][3]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[2][1].sourceID).toBe(
    "SUB2_SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[2][1].destinationID).toBe(
    "SUB2_DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[2][1].path).toStrictEqual(
    ["SUBFOLDER2"],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[2][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[2][3]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[3][1].sourceID).toBe(
    "SUB3_SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[3][1].destinationID).toBe(
    "SUB3_DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[3][1].path).toStrictEqual(
    ["PATH", "TO", "SOME", "DEEP", "SUBFOLDER3"],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[3][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[3][3]).toBe(false);
});

test("move passes copyComments correctly", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockReturnValueOnce({
      destinationID: "DEST_ID",
      path: [],
      sourceID: "SRC_ID",
    })
    .mockReturnValue(null);
  moveStateMock.getErrors.mockReturnValueOnce([]);
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", true, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(true);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(true);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move passes mergeFolders correctly", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockReturnValueOnce({
      destinationID: "DEST_ID",
      path: [],
      sourceID: "SRC_ID",
    })
    .mockReturnValue(null);
  moveStateMock.getErrors.mockReturnValueOnce([]);
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, true, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(true);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(true);
});

test("move detects and reports source matching destination", () => {
  expect(move("SRC_ID", "SRC_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "sourceEqualsDestination",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(0);
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(0);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(0);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move fails gracefully on error when checking folder emptiness", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockImplementationOnce(() => {
    throw new Error("ERROR_DETAIL");
  });

  const ret = move("SRC_ID", "DEST_ID", false, false, false);

  expect(ret.status).toBe("error");
  expect(ret).toHaveProperty("type", "DriveAPIError");
  expect((ret as { detail: string }).detail).toContain("ERROR_DETAIL");
  expect((ret as { detail: string }).detail).toContain("Stack trace");

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(0);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move fails gracefully on non-empty destination directory", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  const moveStateMock = mockedMoveState();
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "notEmpty",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move doesn't care about non-empty destination directory when resuming from an existing move", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockReturnValueOnce({
      destinationID: "DEST_ID",
      path: [],
      sourceID: "SRC_ID",
    })
    .mockReturnValue(null);
  moveStateMock.getErrors.mockReturnValueOnce([]);
  moveStateMock.isNull.mockReturnValueOnce(false).mockReturnValueOnce(false);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(2);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move works correctly with non-empty override", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockReturnValueOnce({
      destinationID: "DEST_ID",
      path: [],
      sourceID: "SRC_ID",
    })
    .mockReturnValue(null);
  moveStateMock.getErrors.mockReturnValueOnce([]);
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, true)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move fails gracefully on invalid parameter types", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  const moveStateMock = mockedMoveState();
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move(42, "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "invalidParameter",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(0);
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(0);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(0);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move fails gracefully on error while moving", () => {
  vi.mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  const error = {
    error: "ERROR_MESSAGE",
    file: ["PATH", "TO", "FILE"],
  };
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockReturnValueOnce({
      destinationID: "DEST_ID",
      path: [],
      sourceID: "SRC_ID",
    })
    .mockReturnValue(null);
  moveStateMock.getErrors.mockReturnValueOnce([error]);
  moveStateMock.isNull.mockReturnValueOnce(true);
  vi.mocked(MoveState_).mockReturnValue(moveStateMock);
  vi.mocked(moveFolder).moveFolder_.mockImplementationOnce(
    (state: MoveState_) => {
      state.logError(error.file, error.error);
    },
  );
  const consoleError = vi
    .spyOn(console, "error")
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- The function is needed just to detect its calls
    .mockImplementationOnce(() => {});

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [error],
    },
    status: "success",
  });

  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(vi.mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(vi.mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(vi.mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(vi.mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(vi.mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(vi.mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(vi.mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(vi.mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(vi.mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(consoleError.mock.calls).toHaveLength(1);
  expect(consoleError.mock.calls[0][0]).toStrictEqual([error]);
});
