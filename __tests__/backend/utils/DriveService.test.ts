import { expect, test } from "@jest/globals";

import { DriveService_ } from "../../../src/backend/utils/DriveService";
import {
  mockedCommentsCollection,
  mockedDrive,
  mockedFilesCollection,
  mockedRepliesCollection,
} from "../../test-utils/gas-stubs";

test("DriveService constructs correctly", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
    Files: mockedFilesCollection(),
    Replies: mockedRepliesCollection(),
  };

  expect(() => {
    new DriveService_();
  }).not.toThrow();
});

test("DriveService throws an error without the Comments collection", () => {
  global.Drive = {
    ...mockedDrive(),
    Files: mockedFilesCollection(),
    Replies: mockedRepliesCollection(),
  };

  expect(() => {
    new DriveService_();
  }).toThrow("");
});

test("DriveService throws an error without the Files collection", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
    Replies: mockedRepliesCollection(),
  };

  expect(() => {
    new DriveService_();
  }).toThrow("");
});

test("DriveService throws an error without the Replies collection", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
    Files: mockedFilesCollection(),
  };

  expect(() => {
    new DriveService_();
  }).toThrow("");
});
