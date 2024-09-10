import type { MockedObject } from "jest-mock";

import { jest } from "@jest/globals";

import type { DeepKeyof, DeepPick } from "../../src/backend/utils/DeepPick";
import type {
  SafeComment,
  SafeCommentList,
  SafeDriveService_,
  SafeFile,
} from "../../src/backend/utils/SafeDriveService";

import { mockedDrivesCollection, mockedRepliesCollection } from "./gas-stubs";

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
    Drives: mockedDrivesCollection(),
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
      // TODO: Not safe
      list: jest.fn<
        (optionalArgs?: {
          fields?: string;
          includeItemsFromAllDrives?: boolean;
          maxResults?: number;
          pageToken?: string | undefined;
          q?: string;
          supportsAllDrives?: boolean;
        }) => GoogleAppsScript.Drive.Schema.FileList
      >(),
      // TODO: Not safe
      remove: jest.fn<(fileId: string) => void>(),
      // TODO: Not safe
      update: jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          fileId: string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
          mediaData?: any,
          optionalArgs?: {
            addParents?: string;
            fields?: string;
            removeParents?: string;
            supportsAllDrives?: boolean;
          },
        ) => GoogleAppsScript.Drive.Schema.File
      >(),
    },
    Replies: mockedRepliesCollection(),
  } as unknown as MockedObject<SafeDriveService_>;
}
