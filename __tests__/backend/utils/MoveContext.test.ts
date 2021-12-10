import { mocked } from "jest-mock";

import { MoveContext_ } from "../../../src/backend/utils/MoveContext";

import { ErrorLogger_ } from "../../../src/backend/utils/ErrorLogger";

jest.mock("../../../src/backend/utils/ErrorLogger");

test("MoveContext constructs correctly", () => {
  const logger = new ErrorLogger_();
  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FILE"],
    logger
  );

  expect(context.sourceID).toBe("SRC_ID");
  expect(context.destinationID).toBe("DEST_ID");
  expect(context.path).toStrictEqual(["PATH", "TO", "FILE"]);
  expect(context.logger).toBe(logger);
});

test("MoveContext creates child context correctly", () => {
  const logger = new ErrorLogger_();
  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FILE"],
    logger
  );
  const childContext = context.childContext(
    "NEW_SRC_ID",
    "NEW_DEST_ID",
    "CHILD_NAME"
  );

  expect(childContext.sourceID).toBe("NEW_SRC_ID");
  expect(childContext.destinationID).toBe("NEW_DEST_ID");
  expect(childContext.path).toStrictEqual(["PATH", "TO", "FILE", "CHILD_NAME"]);
  expect(childContext.logger).toBe(logger);
});

test("MoveContext.tryAndLog works correctly", () => {
  const logger = new ErrorLogger_();
  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FILE"],
    logger
  );

  const fn = jest.fn<void, []>().mockReturnValueOnce();

  context.tryAndLog(fn);

  expect(fn.mock.calls.length).toBe(1);
  expect(mocked(context.logger).log.mock.calls.length).toBe(0);
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

  expect(mocked(context.logger).log.mock.calls.length).toBe(0);
});

test("MoveContext.tryAndLog handles errors gracefully", () => {
  const logger = new ErrorLogger_();
  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FILE"],
    logger
  );

  const fn = jest.fn<void, []>().mockImplementationOnce(() => {
    throw new Error("ERROR_MESSAGE");
  });

  context.tryAndLog(fn);

  expect(mocked(context.logger).log.mock.calls.length).toBe(1);
  expect(mocked(context.logger).log.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FILE",
  ]);
  expect(mocked(context.logger).log.mock.calls[0][1]).toBe("ERROR_MESSAGE");
});
