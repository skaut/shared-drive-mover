import { expect, test } from "@jest/globals";

import { SafeDriveService_ } from "../../../src/backend/utils/SafeDriveService";
import { mockedDrive } from "../../test-utils/gas-stubs";

test("SafeDriveService constructs correctly", () => {
  global.Drive = mockedDrive();

  expect(() => {
    new SafeDriveService_();
  }).not.toThrow();
});
