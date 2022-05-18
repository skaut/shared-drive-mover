import { mocked } from "jest-mock";

import { move } from "../../src/backend/move";

//import type { MoveContext_ } from "../../src/backend/utils/MoveContext";

import * as folderManagement from "../../src/backend/move/folderManagement";
import { mockedMoveState } from "../test-utils/MoveState-stub";
//import * as moveFolderContents from "../../src/backend/move/moveFolderContents";
import * as moveFolder from "../../src/backend/move/moveFolder";
import { MoveState_ } from "../../src/backend/utils/MoveState";

jest.mock("../../src/backend/move/folderManagement");
//jest.mock("../../src/backend/move/moveFolderContents");
jest.mock("../../src/backend/move/moveFolder");
jest.mock("../../src/backend/utils/MoveState", () => ({
  MoveState_: jest.fn(),
}));

test("move works correctly", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  mocked(moveFolder).moveFolder_.mockReturnValueOnce();
  const moveStateMock = mockedMoveState();
  moveStateMock.getNextPath
    .mockImplementationOnce(() => ({
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      path: [],
    }))
    .mockImplementation(() => null);
  moveStateMock.getErrors.mockImplementationOnce(() => []);
  mocked(MoveState_).mockImplementation(() => moveStateMock);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "success",
    response: {
      errors: [],
    },
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID"
  );
  expect(mocked(moveStateMock).loadState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).saveState.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).getNextPath.mock.calls).toHaveLength(2);
  expect(mocked(moveStateMock).getErrors.mock.calls).toHaveLength(1);
  expect(mocked(moveStateMock).destroyState.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls).toHaveLength(1);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].sourceID).toBe(
    "SRC_ID"
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].destinationID).toBe(
    "DEST_ID"
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][1].path).toStrictEqual(
    []
  );
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][2]).toBe(false);
  expect(mocked(moveFolder).moveFolder_.mock.calls[0][3]).toBe(false);
});

/*
test("move passes copyComments correctly", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  mocked(moveFolderContents).moveFolderContents_.mockReturnValueOnce();

  expect(move("SRC_ID", "DEST_ID", true, false, false)).toStrictEqual({
    status: "success",
    response: {
      errors: [],
    },
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls
  ).toHaveLength(1);
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].sourceID
  ).toBe("SRC_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0]
      .destinationID
  ).toBe("DEST_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].path
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][1]).toBe(
    true
  );
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][2]).toBe(
    false
  );
});

test("move passes mergeFolders correctly", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  mocked(moveFolderContents).moveFolderContents_.mockReturnValueOnce();

  expect(move("SRC_ID", "DEST_ID", false, true, false)).toStrictEqual({
    status: "success",
    response: {
      errors: [],
    },
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls
  ).toHaveLength(1);
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].sourceID
  ).toBe("SRC_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0]
      .destinationID
  ).toBe("DEST_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].path
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][1]).toBe(
    false
  );
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][2]).toBe(
    true
  );
});

test("move detects and reports source matching destination", () => {
  mocked(folderManagement).isFolderEmpty_.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(moveFolderContents).moveFolderContents_.mockReturnValueOnce();

  expect(move("SRC_ID", "SRC_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "sourceEqualsDestination",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(0);
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls
  ).toHaveLength(0);
});

test("move fails gracefully on error when checking folder emptiness", () => {
  mocked(folderManagement).isFolderEmpty_.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(moveFolderContents).moveFolderContents_.mockReturnValueOnce();

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls
  ).toHaveLength(0);
});

test("move fails gracefully on non-empty destination directory", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  mocked(moveFolderContents).moveFolderContents_.mockReturnValueOnce();

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    type: "notEmpty",
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls
  ).toHaveLength(0);
});

test("move works correctly with non-empty override", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(false);
  mocked(moveFolderContents).moveFolderContents_.mockReturnValueOnce();

  expect(move("SRC_ID", "DEST_ID", false, false, true)).toStrictEqual({
    status: "success",
    response: {
      errors: [],
    },
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls
  ).toHaveLength(1);
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].sourceID
  ).toBe("SRC_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0]
      .destinationID
  ).toBe("DEST_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].path
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][1]).toBe(
    false
  );
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][2]).toBe(
    false
  );
});

test("move fails gracefully on error while moving", () => {
  mocked(folderManagement).isFolderEmpty_.mockReturnValueOnce(true);
  const error = {
    file: ["PATH", "TO", "FILE"],
    error: "ERROR_MESSAGE",
  };
  mocked(moveFolderContents).moveFolderContents_.mockImplementationOnce(
    (context: MoveContext_) => {
      context.logger.log(error.file, error.error);
    }
  );
  const consoleError = jest
    .spyOn(console, "error")
    .mockImplementationOnce(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "success",
    response: {
      errors: [error],
    },
  });

  expect(mocked(folderManagement).isFolderEmpty_.mock.calls).toHaveLength(1);
  expect(mocked(folderManagement).isFolderEmpty_.mock.calls[0][0]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls
  ).toHaveLength(1);
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].sourceID
  ).toBe("SRC_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0]
      .destinationID
  ).toBe("DEST_ID");
  expect(
    mocked(moveFolderContents).moveFolderContents_.mock.calls[0][0].path
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][1]).toBe(
    false
  );
  expect(mocked(moveFolderContents).moveFolderContents_.mock.calls[0][2]).toBe(
    false
  );
  expect(consoleError.mock.calls).toHaveLength(1);
  expect(consoleError.mock.calls[0][0]).toStrictEqual([error]);
});
*/
