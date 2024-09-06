import type { MockedObject } from "jest-mock";

import type { DriveService_ } from "../../src/backend/utils/DriveService";

import {
  mockedCommentsCollection,
  mockedFilesCollection,
  mockedRepliesCollection,
} from "./gas-stubs";

export function mockedDriveService(): MockedObject<DriveService_> {
  return {
    Comments: mockedCommentsCollection(),
    Files: mockedFilesCollection(),
    Replies: mockedRepliesCollection(),
  } as MockedObject<DriveService_>;
}
