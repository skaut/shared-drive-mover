import { type MockedObject, vi } from "vitest";

import type { DeepKeyof } from "../../../src/backend/utils/DeepKeyof";
import type { DeepPick } from "../../../src/backend/utils/DeepPick";
import type {
  SafeComment,
  SafeCommentList,
  SafeDriveList,
  SafeDriveService_,
  SafeFile,
  SafeFileList,
} from "../../../src/backend/utils/SafeDriveService";

import { mockedRepliesCollection } from "./gas-stubs";

export function mockedSafeDriveService<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- No other way to pass F to vi.fn()
  F extends DeepKeyof<SafeFile>,
>(): MockedObject<SafeDriveService_> {
  // eslint-disable-next-line vitest/prefer-vi-mocked -- Acceptable as return value
  return {
    Comments: {
      insert:
        vi.fn<
          (
            resource: GoogleAppsScript.Drive.Schema.Comment,
            fileId: string,
          ) => SafeComment
        >(),
      list: vi.fn<
        (fileId: string, optionalArgs: Record<never, never>) => SafeCommentList
      >(),
    },
    Drives: {
      list: vi.fn<
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
      copy: vi.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          fileId: string,
          fields: F | null,
          optionalArgs?: { supportsAllDrives?: boolean },
        ) => DeepPick<SafeFile, F>
      >(),
      get: vi.fn<
        (
          fileId: string,
          fields: F | null,
          optionalArgs?: { alt?: string },
        ) => DeepPick<SafeFile, F>
      >(),
      insert: vi.fn<
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
      list: vi.fn<
        (
          fields: F | null,
          optionalArgs?: {
            includeItemsFromAllDrives?: boolean;
            maxResults?: number;
            pageToken?: string;
            q?: string;
            supportsAllDrives?: boolean;
          },
        ) => SafeFileList<F>
      >(),
      remove: vi.fn<(fileId: string) => void>(),
      update: vi.fn<
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
