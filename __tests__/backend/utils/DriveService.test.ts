import { expect, test } from "@jest/globals";

import { DriveService_ } from "../../../src/backend/utils/DriveService";
import { mockedDrive, mockedFilesCollection } from "../../test-utils/gas-stubs";

test("DriveService constructs correctly", () => {
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
    },
  };

  expect(() => {
    new DriveService_();
  }).not.toThrow();
});

test("DriveService throws an error without the Files collection", () => {
  global.Drive = {
    ...mockedDrive(),
  };

  expect(() => {
    new DriveService_();
  }).toThrow("");
});
