import type { MockedObject } from "jest-mock";

import { jest } from "@jest/globals";

import type {
  SafeComment,
  SafeCommentList,
  SafeDriveService_,
} from "../../src/backend/utils/SafeDriveService";

import {
  mockedDrivesCollection,
  mockedFilesCollection,
  mockedRepliesCollection,
} from "./gas-stubs";

export function mockedSafeDriveService(): MockedObject<SafeDriveService_> {
  return {
    Comments: {
      insert:
        jest.fn<
          (
            resource: GoogleAppsScript.Drive.Schema.Comment,
            fileId: string,
          ) => SafeComment
        >(),
      list: jest.fn<
        (fileId: string, optionalArgs: Record<never, never>) => SafeCommentList
      >(),
    },
    Drives: mockedDrivesCollection(),
    Files: mockedFilesCollection(),
    Replies: mockedRepliesCollection(),
  } as unknown as MockedObject<SafeDriveService_>;
}
