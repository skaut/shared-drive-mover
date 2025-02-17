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
  /* eslint-disable @typescript-eslint/no-unnecessary-type-parameters -- No other way to pass F to vi.fn() */
  CommentKeyof extends DeepKeyof<SafeComment>,
  FileKeyof extends DeepKeyof<SafeFile>,
  /* eslint-enable */
>(): MockedObject<SafeDriveService_> {
  // eslint-disable-next-line vitest/prefer-vi-mocked -- Acceptable as return value
  return {
    Comments: {
      create:
        vi.fn<
          (
            resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
            fileId: string,
            fields: CommentKeyof,
          ) => DeepPick<SafeComment, CommentKeyof>
        >(),
      list: vi.fn<
        (
          fileId: string,
          fields: CommentKeyof,
          optionalArgs: { maxResults?: number; pageToken?: string | undefined },
        ) => SafeCommentList<CommentKeyof>
      >(),
    },
    Drives: {
      list: vi.fn<
        (
          fields: FileKeyof | null,
          optionalArgs?: {
            maxResults?: number;
            orderBy?: string;
            pageToken?: string;
          },
        ) => SafeDriveList<FileKeyof>
      >(),
    },
    Files: {
      copy: vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          fileId: string,
          fields: FileKeyof | null,
          optionalArgs?: { supportsAllDrives?: boolean },
        ) => DeepPick<SafeFile, FileKeyof>
      >(),
      create: vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          fields: FileKeyof | null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
          mediaData?: any,
          optionalArgs?: {
            supportsAllDrives?: boolean;
          },
        ) => DeepPick<SafeFile, FileKeyof>
      >(),
      get: vi.fn<
        (
          fileId: string,
          fields: FileKeyof | null,
          optionalArgs?: { alt?: string },
        ) => DeepPick<SafeFile, FileKeyof>
      >(),
      list: vi.fn<
        (
          fields: FileKeyof | null,
          optionalArgs?: {
            includeItemsFromAllDrives?: boolean;
            maxResults?: number;
            pageToken?: string;
            q?: string;
            supportsAllDrives?: boolean;
          },
        ) => SafeFileList<FileKeyof>
      >(),
      remove: vi.fn<(fileId: string) => void>(),
      update: vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          fileId: string,
          fields: FileKeyof | null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required by the Drive API
          mediaData?: any,
          optionalArgs?: {
            addParents?: string;
            removeParents?: string;
            supportsAllDrives?: boolean;
          },
        ) => DeepPick<SafeFile, FileKeyof>
      >(),
    },
    Replies: mockedRepliesCollection(),
  } as unknown as MockedObject<SafeDriveService_>;
}
