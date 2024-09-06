import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import { move } from "../../src/backend/move";
import * as folderManagement from "../../src/backend/move/folderManagement";
import * as moveFolder from "../../src/backend/move/moveFolder";
import { DriveService_ } from "../../src/backend/utils/DriveService";
import { MoveState_ } from "../../src/backend/utils/MoveState";
import { mockedMoveState } from "../test-utils/MoveState-stub";

jest.mock("../../src/backend/move/folderManagement");
jest.mock("../../src/backend/move/moveFolder");
/* eslint-disable @typescript-eslint/naming-convention -- Properties are mock classes */
jest.mock<{ DriveService_: jest.Mock }>(
  "../../src/backend/utils/DriveService",
  () => ({
    DriveService_: jest.fn(),
  }),
);
jest.mock<{ MoveState_: jest.Mock }>(
  "../../src/backend/utils/MoveState",
  () => ({
    MoveState_: jest.fn(),
  }),
);
/* eslint-enable */

test("move works correctly", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
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
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move works correctly with subfolders", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
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
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(5);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(4);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[1][1].sourceID).toBe(
    "SUB1_SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[1][1].destinationID).toBe(
    "SUB1_DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[1][1].path).toStrictEqual([
    "SUBFOLDER1",
  ]);
  expect(mocked(moveFolder).moveFolder_.mock.calls[1][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[1][3]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[2][1].sourceID).toBe(
    "SUB2_SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[2][1].destinationID).toBe(
    "SUB2_DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[2][1].path).toStrictEqual([
    "SUBFOLDER2",
  ]);
  expect(mocked(moveFolder).moveFolder_.mock.calls[2][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[2][3]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[3][1].sourceID).toBe(
    "SUB3_SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[3][1].destinationID).toBe(
    "SUB3_DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[3][1].path).toStrictEqual([
    "PATH",
    "TO",
    "SOME",
    "DEEP",
    "SUBFOLDER3",
  ]);
  expect(mocked(moveFolder).moveFolder_.mock.calls[3][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[3][3]).toBe(false);
});

test("move passes copyComments correctly", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
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
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", true, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(true);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(true);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move passes mergeFolders correctly", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
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
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, true, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(true);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(true);
});

test("move detects and reports source matching destination", () => {
  expect(move("SRC_ID", "SRC_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "sourceEqualsDestination",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(0);
  expect(mocked(DriveService_).mock.calls).toHaveLength(0);
  expect(mocked(MoveState_).mock.calls).toHaveLength(0);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move fails gracefully on error when checking folder emptiness", () => {
  mocked(folderManagement).isFolderEmpty_.mockImplementationOnce(() => {
    throw new Error();
  });

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(0);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move fails gracefully on non-empty destination directory", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  const moveStateMock = mockedMoveState();
  moveStateMock.isNull.mockReturnValueOnce(true);
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "notEmpty",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(0);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move doesn't care about non-empty destination directory when resuming from an existing move", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
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
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move works correctly with non-empty override", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
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
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, true)).toStrictEqual({
    response: {
      errors: [],
    },
    status: "success",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

test("move fails gracefully on invalid parameter types", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  const moveStateMock = mockedMoveState();
  moveStateMock.isNull.mockReturnValueOnce(true);
  mocked(MoveState_).mockReturnValue(moveStateMock);

  expect(move(42, "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "invalidParameter",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(0);
  expect(mocked(DriveService_).mock.calls).toHaveLength(0);
  expect(mocked(MoveState_).mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(0);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(0);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(0);
});

test("move fails gracefully on error while moving", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
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
  mocked(MoveState_).mockReturnValue(moveStateMock);
  mocked(moveFolder).moveFolder_.mockImplementationOnce((state: MoveState_) => {
    state.logError(error.file, error.error);
  });
  const consoleError = jest
    .spyOn(console, "error")
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- The function is needed just to detect its calls
    .mockImplementationOnce(() => {});

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    response: {
      errors: [error],
    },
    status: "success",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID",
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    [],
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls).toHaveLength(1);
  expect(mocked(MoveState_).mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(MoveState_).mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(MoveState_).mock.calls[0][2]).toBe(false);
  expect(mocked(MoveState_).mock.calls[0][3]).toBe(false);
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).isNull.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).addPath.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][1]).toBe("DEST_ID");
  expect(mocked(moveStateMock).addPath.mock.calls[0][2]).toStrictEqual([]);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(consoleError.mock.calls).toHaveLength(1);
  expect(consoleError.mock.calls[0][0]).toStrictEqual([error]);
});
