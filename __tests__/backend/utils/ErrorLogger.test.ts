import { ErrorLogger_ } from "../../../src/backend/utils/ErrorLogger";

test("ErrorLogger constructs correctly", () => {
  const logger = new ErrorLogger_();

  expect(logger.get()).toStrictEqual([]);
});

test("ErrorLogger logs errors", () => {
  const logger = new ErrorLogger_();
  const error1 = {
    file: ["PATH", "TO", "FILE1"],
    error: "ERROR_MESSAGE1",
  };
  const error2 = {
    file: ["PATH", "TO", "FILE2"],
    error: "ERROR_MESSAGE2",
  };
  logger.log(error1.file, error1.error);
  logger.log(error2.file, error2.error);

  expect(logger.get()).toStrictEqual([error1, error2]);
});

test("ErrorLogger reports no errors correctly correctly", () => {
  const logger = new ErrorLogger_();

  expect(logger.isEmpty()).toBe(true);
});

test("ErrorLogger reports some errors correctly correctly", () => {
  const logger = new ErrorLogger_();
  logger.log(["PATH", "TO", "FILE"], "ERROR_MESSAGE");

  expect(logger.isEmpty()).toBe(false);
});
