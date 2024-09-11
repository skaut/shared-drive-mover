import type { MockedObject } from "jest-mock";

import { jest } from "@jest/globals";

import type { DeepKeyof } from "../../src/backend/utils/DeepKeyof";
import type { DeepPick } from "../../src/backend/utils/DeepPick";
import type {
  SafeComment,
  SafeCommentList,
  SafeDriveList,
  SafeDriveService_,
  SafeFile,
  SafeFileList,
} from "../../src/backend/utils/SafeDriveService";

import { mockedRepliesCollection } from "./gas-stubs";

export function mockedSafeDriveService<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- No other way to pass F to jest.fn()
  F extends DeepKeyof<SafeFile>,
>(): MockedObject<SafeDriveService_> {
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
    Drives: {
      list: jest.fn<
        (
          fields: F | null,
          optionalArgs?: {
            maxResults?: number;
            orderBy?: string;
            pageToken?: string;
          },
        ) => SafeDriveList<F>
      >(),
    },
    Files: {
      copy: jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          fileId: string,
          fields: F | null,
          optionalArgs?: { supportsAllDrives?: boolean },
        ) => DeepPick<SafeFile, F>
      >(),
      get: jest.fn<
        (
          fileId: string,
          fields: F | null,
          optionalArgs?: { alt?: string },
        ) => DeepPick<SafeFile, F>
      >(),
      insert: jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          fields: F | null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
          mediaData?: any,
          optionalArgs?: {
            supportsAllDrives?: boolean;
          },
        ) => DeepPick<SafeFile, F>
      >(),
      list: jest.fn<
        (
          fields: F | null,
          optionalArgs?: {
            includeItemsFromAllDrives?: boolean;
            maxResults?: number;
            pageToken?: string | undefined;
            q?: string;
            supportsAllDrives?: boolean;
          },
        ) => SafeFileList<F>
      >(),
      remove: jest.fn<(fileId: string) => void>(),
      update: jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          fileId: string,
          fields: F | null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
          mediaData?: any,
          optionalArgs?: {
            addParents?: string;
            removeParents?: string;
            supportsAllDrives?: boolean;
          },
        ) => DeepPick<SafeFile, F>
      >(),
    },
    Replies: mockedRepliesCollection(),
  } as unknown as MockedObject<SafeDriveService_>;
}
