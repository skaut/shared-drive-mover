import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";
import { MoveState_ } from "../../../src/backend/utils/MoveState";
import { mockedDriveBackedValue } from "../../test-utils/DriveBackedValue-stub";

jest.mock("../../../src/backend/utils/DriveBackedValue", () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention -- Mocking a class
  DriveBackedValue_: jest.fn(),
}));

test("MoveState constructs correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  expect(mocked(DriveBackedValue_).mock.calls).toHaveLength(1);
  expect(mocked(DriveBackedValue_).mock.calls[0][0]).toBe(
    JSON.stringify({
      sourceID: "SRC_BASE_ID",
      destinationID: "DEST_BASE_ID",
      copyComments: false,
      mergeFolders: false,
    }),
  );
  expect(state.getNextPath()).toBeNull();
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState correctly reports unitialized state", () => {
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  expect(state.isNull()).toBe(true);
  expect(state.getNextPath()).toBeNull();
});

test("MoveState correctly reports itialized state", () => {
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.addPath("SRC_ID", "DEST_ID", []);
  expect(state.isNull()).toBe(false);
  expect(state.getNextPath()).toStrictEqual({
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: [],
  });
});

test("MoveState correctly reports last added path", () => {
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.addPath("SRC_ID1", "DEST_ID1", []);
  state.addPath("SRC_ID2", "DEST_ID2", ["PATH", "TO", "FIRST", "FOLDER"]);
  state.addPath("SRC_ID3", "DEST_ID3", ["ANOTHER", "DIRECTORY"]);
  expect(state.getNextPath()).toStrictEqual({
    sourceID: "SRC_ID3",
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
  });
  expect(state.getNextPath()).toStrictEqual({
    sourceID: "SRC_ID3",
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
  });
});

test("MoveState correctly removes paths", () => {
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.addPath("SRC_ID1", "DEST_ID1", []);
  state.addPath("SRC_ID2", "DEST_ID2", ["PATH", "TO", "FIRST", "FOLDER"]);
  state.addPath("SRC_ID3", "DEST_ID3", ["ANOTHER", "DIRECTORY"]);
  expect(state.getNextPath()).toStrictEqual({
    sourceID: "SRC_ID3",
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
  });
  state.removePath({
    sourceID: "SRC_ID2",
    destinationID: "DEST_ID2",
    path: ["PATH", "TO", "FIRST", "FOLDER"],
  });
  expect(state.getNextPath()).toStrictEqual({
    sourceID: "SRC_ID3",
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
  });
  state.removePath({
    sourceID: "SRC_ID3",
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
  });
  expect(state.getNextPath()).toStrictEqual({
    sourceID: "SRC_ID1",
    destinationID: "DEST_ID1",
    path: [],
  });
  state.removePath({
    sourceID: "SRC_ID1",
    destinationID: "DEST_ID1",
    path: [],
  });
  expect(state.getNextPath()).toBeNull();
});

test("MoveState doesn't fail on invalid path removal", () => {
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  expect(() => {
    state.removePath({
      sourceID: "SRC_ID1",
      destinationID: "DEST_ID1",
      path: [],
    });
  }).not.toThrow();
  state.addPath("SRC_ID1", "DEST_ID1", []);
  expect(() => {
    state.removePath({
      sourceID: "SRC_ID2",
      destinationID: "DEST_ID2",
      path: [],
    });
  }).not.toThrow();
  state.removePath({
    sourceID: "SRC_ID1",
    destinationID: "DEST_ID1",
    path: [],
  });
  expect(() => {
    state.removePath({
      sourceID: "SRC_ID1",
      destinationID: "DEST_ID1",
      path: [],
    });
  }).not.toThrow();
});

test("MoveState logs errors", () => {
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  const error1 = {
    file: ["PATH", "TO", "FILE1"],
    error: "ERROR_MESSAGE1",
  };
  const error2 = {
    file: ["PATH", "TO", "FILE2"],
    error: "ERROR_MESSAGE2",
  };
  state.logError(error1.file, error1.error);
  state.logError(error2.file, error2.error);

  expect(state.getErrors()).toStrictEqual([error1, error2]);
});

test("MoveState.tryOrLog works correctly", () => {
  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  const fn = jest.fn<() => void>().mockReturnValueOnce();

  state.tryOrLog(context, fn);

  expect(fn.mock.calls).toHaveLength(1);
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState.tryOrLog returns values correctly", () => {
  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  const returnValue = { complex: { return: "object" } };

  expect(state.tryOrLog(context, () => returnValue)).toStrictEqual(returnValue);

  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState.tryOrLog handles errors gracefully", () => {
  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  const fn = jest.fn<() => void>().mockImplementationOnce(() => {
    throw new Error("ERROR_MESSAGE");
  });

  state.tryOrLog(context, fn);

  expect(state.getErrors()).toStrictEqual([
    {
      error: "ERROR_MESSAGE",
      file: ["PATH", "TO", "FOLDER"],
    },
  ]);
});

test("MoveState.tryOrLog handles errors gracefully with a filename", () => {
  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  const fn = jest.fn<() => void>().mockImplementationOnce(() => {
    throw new Error("ERROR_MESSAGE");
  });

  state.tryOrLog(context, fn, "FILENAME");

  expect(state.getErrors()).toStrictEqual([
    {
      error: "ERROR_MESSAGE",
      file: ["PATH", "TO", "FOLDER", "FILENAME"],
    },
  ]);
});

test("MoveState saves the state correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.addPath("SRC_ID1", "DEST_ID1", []);
  state.addPath("SRC_ID2", "DEST_ID2", ["PATH", "TO", "FIRST", "FOLDER"]);
  state.addPath("SRC_ID3", "DEST_ID3", ["ANOTHER", "DIRECTORY"]);
  const error1 = {
    file: ["PATH", "TO", "FILE1"],
    error: "ERROR_MESSAGE1",
  };
  const error2 = {
    file: ["PATH", "TO", "FILE2"],
    error: "ERROR_MESSAGE2",
  };
  state.logError(error1.file, error1.error);
  state.logError(error2.file, error2.error);
  state.saveState();

  expect(driveBackedValueMock.saveValue.mock.calls).toHaveLength(3);
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].pathsToProcess,
  ).toHaveLength(3);
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].pathsToProcess[0],
  ).toStrictEqual({ sourceID: "SRC_ID1", destinationID: "DEST_ID1", path: [] });
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].pathsToProcess[1],
  ).toStrictEqual({
    sourceID: "SRC_ID2",
    destinationID: "DEST_ID2",
    path: ["PATH", "TO", "FIRST", "FOLDER"],
  });
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].pathsToProcess[2],
  ).toStrictEqual({
    sourceID: "SRC_ID3",
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
  });
  expect(driveBackedValueMock.saveValue.mock.calls[0][0].errors).toHaveLength(
    2,
  );
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].errors[0],
  ).toStrictEqual(error1);
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].errors[1],
  ).toStrictEqual(error2);
});

test("MoveState doesn't save empty state", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.saveState();

  expect(driveBackedValueMock.saveValue.mock.calls).toHaveLength(0);
});

test("MoveState loads the state correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  const path = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  const error1 = {
    file: ["PATH", "TO", "FILE1"],
    error: "ERROR_MESSAGE1",
  };
  const error2 = {
    file: ["PATH", "TO", "FILE2"],
    error: "ERROR_MESSAGE2",
  };
  driveBackedValueMock.loadValue.mockReturnValueOnce({
    pathsToProcess: [path],
    errors: [error1, error2],
  });
  mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.loadState();

  expect(state.getNextPath()).not.toBeNull();
  expect(state.getNextPath()).toStrictEqual(path);
  expect(state.getErrors()[0]).toStrictEqual(error1);
  expect(state.getErrors()[1]).toStrictEqual(error2);
});

test("MoveState handles empty state load correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  driveBackedValueMock.loadValue.mockReturnValueOnce(null);
  mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.loadState();

  expect(state.getNextPath()).toBeNull();
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState destroys state correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  state.addPath("SRC_ID1", "DEST_ID1", []);
  state.addPath("SRC_ID2", "DEST_ID2", ["PATH", "TO", "FIRST", "FOLDER"]);
  state.addPath("SRC_ID3", "DEST_ID3", ["ANOTHER", "DIRECTORY"]);
  state.logError(["PATH", "TO", "FILE1"], "ERROR_MESSAGE1");
  state.logError(["PATH", "TO", "FILE2"], "ERROR_MESSAGE2");
  state.destroyState();

  expect(driveBackedValueMock.deleteValue.mock.calls).toHaveLength(1);
  expect(state.getNextPath()).toBeNull();
  expect(state.getErrors()).toStrictEqual([]);
});
