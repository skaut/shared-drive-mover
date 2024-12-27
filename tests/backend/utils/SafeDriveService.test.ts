import { expect, test } from "vitest";

import { SafeDriveService_ } from "../../../src/backend/utils/SafeDriveService";
import {
  mockedCommentsCollection,
  mockedDrive,
  mockedDrivesCollection,
  mockedFilesCollection,
  mockedRepliesCollection,
} from "../test-utils/gas-stubs";

test("SafeDriveService constructs correctly", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
    Drives: mockedDrivesCollection(),
    Files: mockedFilesCollection(),
    Replies: mockedRepliesCollection(),
  };

  expect(() => {
    new SafeDriveService_();
  }).not.toThrow();
});
