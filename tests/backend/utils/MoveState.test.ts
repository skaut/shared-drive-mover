import { expect, test, vi } from "vitest";

import { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";
import { MoveState_ } from "../../../src/backend/utils/MoveState";
import { mockedDriveBackedValue } from "../test-utils/DriveBackedValue-stub";
import { mockedSafeDriveService } from "../test-utils/SafeDriveService-stub";

vi.mock("../../../src/backend/utils/DriveBackedValue");

test("MoveState constructs correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  expect(vi.mocked(DriveBackedValue_).mock.calls).toHaveLength(1);
  expect(vi.mocked(DriveBackedValue_).mock.calls[0][0]).toBe(
    JSON.stringify({
      copyComments: false,
      destinationID: "DEST_BASE_ID",
      mergeFolders: false,
      sourceID: "SRC_BASE_ID",
    }),
  );
  expect(state.getNextPath()).toBeNull();
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState correctly reports unitialized state", () => {
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  expect(state.isNull()).toBe(true);
  expect(state.getNextPath()).toBeNull();
});

test("MoveState correctly reports itialized state", () => {
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  state.addPath("SRC_ID", "DEST_ID", []);

  expect(state.isNull()).toBe(false);
  expect(state.getNextPath()).toStrictEqual({
    destinationID: "DEST_ID",
    path: [],
    sourceID: "SRC_ID",
  });
});

test("MoveState correctly reports last added path", () => {
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  state.addPath("SRC_ID1", "DEST_ID1", []);
  state.addPath("SRC_ID2", "DEST_ID2", ["PATH", "TO", "FIRST", "FOLDER"]);
  state.addPath("SRC_ID3", "DEST_ID3", ["ANOTHER", "DIRECTORY"]);

  expect(state.getNextPath()).toStrictEqual({
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
    sourceID: "SRC_ID3",
  });
  expect(state.getNextPath()).toStrictEqual({
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
    sourceID: "SRC_ID3",
  });
});

test("MoveState correctly removes paths", () => {
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  state.addPath("SRC_ID1", "DEST_ID1", []);
  state.addPath("SRC_ID2", "DEST_ID2", ["PATH", "TO", "FIRST", "FOLDER"]);
  state.addPath("SRC_ID3", "DEST_ID3", ["ANOTHER", "DIRECTORY"]);

  expect(state.getNextPath()).toStrictEqual({
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
    sourceID: "SRC_ID3",
  });

  state.removePath({
    destinationID: "DEST_ID2",
    path: ["PATH", "TO", "FIRST", "FOLDER"],
    sourceID: "SRC_ID2",
  });

  expect(state.getNextPath()).toStrictEqual({
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
    sourceID: "SRC_ID3",
  });

  state.removePath({
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
    sourceID: "SRC_ID3",
  });

  expect(state.getNextPath()).toStrictEqual({
    destinationID: "DEST_ID1",
    path: [],
    sourceID: "SRC_ID1",
  });

  state.removePath({
    destinationID: "DEST_ID1",
    path: [],
    sourceID: "SRC_ID1",
  });

  expect(state.getNextPath()).toBeNull();
});

test("MoveState doesn't fail on invalid path removal", () => {
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  expect(() => {
    state.removePath({
      destinationID: "DEST_ID1",
      path: [],
      sourceID: "SRC_ID1",
    });
  }).not.toThrow();

  state.addPath("SRC_ID1", "DEST_ID1", []);

  expect(() => {
    state.removePath({
      destinationID: "DEST_ID2",
      path: [],
      sourceID: "SRC_ID2",
    });
  }).not.toThrow();

  state.removePath({
    destinationID: "DEST_ID1",
    path: [],
    sourceID: "SRC_ID1",
  });

  expect(() => {
    state.removePath({
      destinationID: "DEST_ID1",
      path: [],
      sourceID: "SRC_ID1",
    });
  }).not.toThrow();
});

test("MoveState logs errors", () => {
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  const error1 = {
    error: "ERROR_MESSAGE1",
    file: ["PATH", "TO", "FILE1"],
  };
  const error2 = {
    error: "ERROR_MESSAGE2",
    file: ["PATH", "TO", "FILE2"],
  };
  state.logError(error1.file, error1.error);
  state.logError(error2.file, error2.error);

  expect(state.getErrors()).toStrictEqual([error1, error2]);
});

test("MoveState.tryOrLog works correctly", () => {
  const context = {
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
    sourceID: "SRC_ID",
  };
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  const fn = vi.fn<() => void>().mockReturnValueOnce();

  state.tryOrLog(context, fn);

  expect(fn.mock.calls).toHaveLength(1);
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState.tryOrLog returns values correctly", () => {
  const context = {
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
    sourceID: "SRC_ID",
  };
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  const returnValue = { complex: { return: "object" } };

  expect(state.tryOrLog(context, () => returnValue)).toStrictEqual(returnValue);

  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState.tryOrLog handles errors gracefully", () => {
  const context = {
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
    sourceID: "SRC_ID",
  };
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  const fn = vi.fn<() => void>().mockImplementationOnce(() => {
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
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
    sourceID: "SRC_ID",
  };
  const driveServiceMock = mockedSafeDriveService();
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  const fn = vi.fn<() => void>().mockImplementationOnce(() => {
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
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  state.addPath("SRC_ID1", "DEST_ID1", []);
  state.addPath("SRC_ID2", "DEST_ID2", ["PATH", "TO", "FIRST", "FOLDER"]);
  state.addPath("SRC_ID3", "DEST_ID3", ["ANOTHER", "DIRECTORY"]);
  const error1 = {
    error: "ERROR_MESSAGE1",
    file: ["PATH", "TO", "FILE1"],
  };
  const error2 = {
    error: "ERROR_MESSAGE2",
    file: ["PATH", "TO", "FILE2"],
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
  ).toStrictEqual({ destinationID: "DEST_ID1", path: [], sourceID: "SRC_ID1" });
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].pathsToProcess[1],
  ).toStrictEqual({
    destinationID: "DEST_ID2",
    path: ["PATH", "TO", "FIRST", "FOLDER"],
    sourceID: "SRC_ID2",
  });
  expect(
    driveBackedValueMock.saveValue.mock.calls[0][0].pathsToProcess[2],
  ).toStrictEqual({
    destinationID: "DEST_ID3",
    path: ["ANOTHER", "DIRECTORY"],
    sourceID: "SRC_ID3",
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
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  state.saveState();

  expect(driveBackedValueMock.saveValue.mock.calls).toHaveLength(0);
});

test("MoveState loads the state correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  const path = {
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
    sourceID: "SRC_ID",
  };
  const error1 = {
    error: "ERROR_MESSAGE1",
    file: ["PATH", "TO", "FILE1"],
  };
  const error2 = {
    error: "ERROR_MESSAGE2",
    file: ["PATH", "TO", "FILE2"],
  };
  driveBackedValueMock.loadValue.mockReturnValueOnce({
    errors: [error1, error2],
    pathsToProcess: [path],
  });
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  state.loadState();

  expect(state.getNextPath()).not.toBeNull();
  expect(state.getNextPath()).toStrictEqual(path);
  expect(state.getErrors()[0]).toStrictEqual(error1);
  expect(state.getErrors()[1]).toStrictEqual(error2);
});

test("MoveState handles empty state load correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  driveBackedValueMock.loadValue.mockReturnValueOnce(null);
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  state.loadState();

  expect(state.getNextPath()).toBeNull();
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState destroys state correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
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
