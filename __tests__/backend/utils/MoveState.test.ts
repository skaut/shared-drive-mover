import { mocked } from "jest-mock";

import { mockedDriveBackedValue } from "../../test-utils/DriveBackedValue-stub";
import { MoveState_ } from "../../../src/backend/utils/MoveState";

import { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";

jest.mock("../../../src/backend/utils/DriveBackedValue", () => ({
  DriveBackedValue_: jest.fn(),
}));

test("MoveState constructs correctly", () => {
  const driveBackedValueMock = mockedDriveBackedValue();
  mocked(DriveBackedValue_).mockReturnValue(driveBackedValueMock);

  const state = new MoveState_("SRC_ID", "DEST_ID", false, false);

  expect(mocked(DriveBackedValue_).mock.calls).toHaveLength(1);
  expect(mocked(DriveBackedValue_).mock.calls[0][0]).toBe(
    JSON.stringify({
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      copyComments: false,
      mergeFolders: false,
    })
  );
  expect(state.getNextPath()).toBeNull();
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveState.tryOrLog works correctly", () => {
  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  const fn = jest.fn<void, []>().mockReturnValueOnce(); // eslint-disable-line @typescript-eslint/no-invalid-void-type

  state.tryOrLog(context, fn);

  expect(fn.mock.calls).toHaveLength(1);
  expect(state.getErrors()).toStrictEqual([]);
});

test("MoveContext.tryAndLog returns values correctly", () => {
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

test("MoveContext.tryAndLog handles errors gracefully", () => {
  const context = {
    sourceID: "SRC_ID",
    destinationID: "DEST_ID",
    path: ["PATH", "TO", "FOLDER"],
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const fn = jest.fn<void, []>().mockImplementationOnce(() => {
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
