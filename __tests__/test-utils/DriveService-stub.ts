import type { MockedObject } from "jest-mock";

import type { DriveService_ } from "../../src/backend/utils/DriveService";

import { mockedFilesCollection } from "./gas-stubs";

export function mockedDriveService(): MockedObject<DriveService_> {
  return {
    Files: mockedFilesCollection(),
  } as MockedObject<DriveService_>;
}
