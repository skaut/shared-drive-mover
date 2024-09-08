import type { MockedObject } from "jest-mock";

import { jest } from "@jest/globals";

import type {
  DriveService_,
  SafeComment,
  SafeCommentList,
} from "../../src/backend/utils/DriveService";

import {
  mockedDrivesCollection,
  mockedFilesCollection,
  mockedRepliesCollection,
} from "./gas-stubs";

export function mockedDriveService(): MockedObject<DriveService_> {
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
  } as unknown as MockedObject<DriveService_>;
}
