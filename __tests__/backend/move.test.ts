import { mocked } from "ts-jest/utils";

import { move } from "../../src/backend/move";

import * as isFolderEmpty from "../../src/backend/move/isFolderEmpty";
import * as moveFolderContents from "../../src/backend/move/moveFolderContents";

jest.mock("../../src/backend/move/isFolderEmpty");
jest.mock("../../src/backend/move/moveFolderContents");

test("move works correctly", () => {
  mocked(isFolderEmpty).isFolderEmpty.mockReturnValueOnce(true);
  mocked(moveFolderContents).moveFolderContents.mockReturnValueOnce([]);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "success",
    errors: [],
  });

  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls.length).toBe(1);
  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls[0][0]).toBe("DEST_ID");
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls.length).toBe(
    1
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][0]).toBe(
    "SRC_ID"
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][1]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents.mock.calls[0][2]
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][3]).toBe(
    false
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][4]).toBe(
    false
  );
});

test("move passes copyComments correctly", () => {
  mocked(isFolderEmpty).isFolderEmpty.mockReturnValueOnce(true);
  mocked(moveFolderContents).moveFolderContents.mockReturnValueOnce([]);

  expect(move("SRC_ID", "DEST_ID", true, false, false)).toStrictEqual({
    status: "success",
    errors: [],
  });

  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls.length).toBe(1);
  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls[0][0]).toBe("DEST_ID");
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls.length).toBe(
    1
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][0]).toBe(
    "SRC_ID"
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][1]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents.mock.calls[0][2]
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][3]).toBe(
    true
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][4]).toBe(
    false
  );
});

test("move passes mergeFolders correctly", () => {
  mocked(isFolderEmpty).isFolderEmpty.mockReturnValueOnce(true);
  mocked(moveFolderContents).moveFolderContents.mockReturnValueOnce([]);

  expect(move("SRC_ID", "DEST_ID", false, true, false)).toStrictEqual({
    status: "success",
    errors: [],
  });

  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls.length).toBe(1);
  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls[0][0]).toBe("DEST_ID");
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls.length).toBe(
    1
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][0]).toBe(
    "SRC_ID"
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][1]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents.mock.calls[0][2]
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][3]).toBe(
    false
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][4]).toBe(
    true
  );
});

test("move fails gracefully on non-empty destination directory", () => {
  mocked(isFolderEmpty).isFolderEmpty.mockReturnValueOnce(false);
  mocked(moveFolderContents).moveFolderContents.mockReturnValueOnce([]);

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "error",
    reason: "notEmpty",
  });

  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls.length).toBe(1);
  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls[0][0]).toBe("DEST_ID");
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls.length).toBe(
    0
  );
});

test("move works correctly with non-empty override", () => {
  mocked(isFolderEmpty).isFolderEmpty.mockReturnValueOnce(false);
  mocked(moveFolderContents).moveFolderContents.mockReturnValueOnce([]);

  expect(move("SRC_ID", "DEST_ID", false, false, true)).toStrictEqual({
    status: "success",
    errors: [],
  });

  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls.length).toBe(1);
  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls[0][0]).toBe("DEST_ID");
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls.length).toBe(
    1
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][0]).toBe(
    "SRC_ID"
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][1]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents.mock.calls[0][2]
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][3]).toBe(
    false
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][4]).toBe(
    false
  );
});

test("move fails gracefully on error while moving", () => {
  mocked(isFolderEmpty).isFolderEmpty.mockReturnValueOnce(true);
  const error = {
    file: ["PATH", "TO", "FILE"],
    error: "ERROR_MESSAGE",
  };
  mocked(moveFolderContents).moveFolderContents.mockReturnValueOnce([error]);
  const consoleError = jest
    .spyOn(console, "error")
    .mockImplementationOnce(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function

  expect(move("SRC_ID", "DEST_ID", false, false, false)).toStrictEqual({
    status: "success",
    errors: [error],
  });

  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls.length).toBe(1);
  expect(mocked(isFolderEmpty).isFolderEmpty.mock.calls[0][0]).toBe("DEST_ID");
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls.length).toBe(
    1
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][0]).toBe(
    "SRC_ID"
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][1]).toBe(
    "DEST_ID"
  );
  expect(
    mocked(moveFolderContents).moveFolderContents.mock.calls[0][2]
  ).toStrictEqual([]);
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][3]).toBe(
    false
  );
  expect(mocked(moveFolderContents).moveFolderContents.mock.calls[0][4]).toBe(
    false
  );
  expect(consoleError.mock.calls.length).toBe(1);
  expect(consoleError.mock.calls[0][0]).toStrictEqual([error]);
});
