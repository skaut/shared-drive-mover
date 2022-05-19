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

/*
test("MoveContext.tryAndLog works correctly", () => {
  const logger = new ErrorLogger_();
  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FILE"],
    logger
  );

  const fn = jest.fn<void, []>().mockReturnValueOnce(); // eslint-disable-line @typescript-eslint/no-invalid-void-type

  context.tryAndLog(fn);

  expect(fn.mock.calls).toHaveLength(1);
  expect(mocked(context.logger).log.mock.calls).toHaveLength(0);
});

test("MoveContext.tryAndLog returns values correctly", () => {
  const logger = new ErrorLogger_();
  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FILE"],
    logger
  );

  const returnValue = { complex: { return: "object" } };

  expect(context.tryAndLog(() => returnValue)).toStrictEqual(returnValue);

  expect(mocked(context.logger).log.mock.calls).toHaveLength(0);
});

test("MoveContext.tryAndLog handles errors gracefully", () => {
  const logger = new ErrorLogger_();
  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FILE"],
    logger
  );

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const fn = jest.fn<void, []>().mockImplementationOnce(() => {
    throw new Error("ERROR_MESSAGE");
  });

  context.tryAndLog(fn);

  expect(mocked(context.logger).log.mock.calls).toHaveLength(1);
  expect(mocked(context.logger).log.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FILE",
  ]);
  expect(mocked(context.logger).log.mock.calls[0][1]).toBe("ERROR_MESSAGE");
});
*/
