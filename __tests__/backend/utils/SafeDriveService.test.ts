import { expect, test } from "@jest/globals";

import { SafeDriveService_ } from "../../../src/backend/utils/SafeDriveService";
import {
  mockedCommentsCollection,
  mockedDrive,
  mockedDrivesCollection,
  mockedFilesCollection,
  mockedRepliesCollection,
} from "../../test-utils/gas-stubs";

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

test("SafeDriveService throws an error without the Comments collection", () => {
  global.Drive = {
    ...mockedDrive(),
    Drives: mockedDrivesCollection(),
    Files: mockedFilesCollection(),
    Replies: mockedRepliesCollection(),
  };

  expect(() => {
    new SafeDriveService_();
  }).toThrow("");
});

test("SafeDriveService throws an error without the Drives collection", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
    Files: mockedFilesCollection(),
    Replies: mockedRepliesCollection(),
  };

  expect(() => {
    new SafeDriveService_();
  }).toThrow("");
});

test("SafeDriveService throws an error without the Files collection", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
    Drives: mockedDrivesCollection(),
    Replies: mockedRepliesCollection(),
  };

  expect(() => {
    new SafeDriveService_();
  }).toThrow("");
});

test("SafeDriveService throws an error without the Replies collection", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
    Drives: mockedDrivesCollection(),
    Files: mockedFilesCollection(),
  };

  expect(() => {
    new SafeDriveService_();
  }).toThrow("");
});
