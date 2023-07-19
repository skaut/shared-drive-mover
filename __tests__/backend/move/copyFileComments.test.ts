import { expect, jest, test } from "@jest/globals";

import { copyFileComments_ } from "../../../src/backend/move/copyFileComments";
import {
  mockedCommentsCollection,
  mockedDrive,
  mockedRepliesCollection,
} from "../../test-utils/gas-stubs";

test("copyFileComments works correctly", () => {
  interface ListCommentsOptions {
    maxResults?: number;
    pageToken?: string;
    fields?: string;
  }

  const rawResponse = {
    items: [
      {
        author: { displayName: "COM1_AUTH", isAuthenticatedUser: false },
        commentId: "SRC_COM1_ID",
        content: "COM1_CONTENT",
        replies: [],
      },
      {
        author: { displayName: "COM2_AUTH", isAuthenticatedUser: true },
        commentId: "SRC_COM2_ID",
        content: "COM2_CONTENT",
        replies: [],
      },
    ],
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: ListCommentsOptions,
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(rawResponse);
  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.Comment,
        fileId: string,
      ) => GoogleAppsScript.Drive.Schema.Comment
    >()
    .mockReturnValueOnce({
      commentId: "DEST_COM1_ID",
    })
    .mockReturnValueOnce({
      commentId: "DEST_COM2_ID",
    });
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
      insert,
    },
  };

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("SRC_FILE_ID");
  expect(list.mock.calls[0][1]).toBeDefined();
  expect(list.mock.calls[0][1]!.pageToken).toBeUndefined();
  expect(
    list.mock.calls[0][1]!.fields!.split(",").map((s) => s.trim()),
  ).toContain("nextPageToken");
  expect(insert.mock.calls).toHaveLength(2);
  expect(insert.mock.calls[0][0].content).toBe("*COM1_AUTH:*\nCOM1_CONTENT");
  expect(insert.mock.calls[0][0].replies).toBeUndefined();
  expect(insert.mock.calls[0][1]).toBe("DEST_FILE_ID");
  expect(insert.mock.calls[1][0].content).toBe("COM2_CONTENT");
  expect(insert.mock.calls[1][0].replies).toBeUndefined();
  expect(insert.mock.calls[1][1]).toBe("DEST_FILE_ID");
});

test("copyFileComments works correctly with replies", () => {
  interface ListCommentsOptions {
    maxResults?: number;
    pageToken?: string;
    fields?: string;
  }

  const rawResponse = {
    items: [
      {
        author: { displayName: "COM_AUTH", isAuthenticatedUser: true },
        commentId: "SRC_COM_ID",
        content: "COM_CONTENT",
        replies: [
          {
            author: { displayName: "REPLY1_AUTH", isAuthenticatedUser: false },
            content: "REPLY1_CONTENT",
          },
          {
            author: { displayName: "REPLY2_AUTH", isAuthenticatedUser: true },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: ListCommentsOptions,
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(rawResponse);
  const insertComment = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.Comment,
        fileId: string,
      ) => GoogleAppsScript.Drive.Schema.Comment
    >()
    .mockReturnValueOnce({
      commentId: "DEST_COM_ID",
    });
  const insertReply = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.CommentReply,
        fileId: string,
        commentId: string,
      ) => GoogleAppsScript.Drive.Schema.CommentReply
    >()
    .mockReturnValueOnce({});
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
      insert: insertComment,
    },
    Replies: {
      ...mockedRepliesCollection(),
      insert: insertReply,
    },
  };

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("SRC_FILE_ID");
  expect(list.mock.calls[0][1]).toBeDefined();
  expect(list.mock.calls[0][1]!.pageToken).toBeUndefined();
  expect(
    list.mock.calls[0][1]!.fields!.split(",").map((s) => s.trim()),
  ).toContain("nextPageToken");
  expect(insertComment.mock.calls).toHaveLength(1);
  expect(insertComment.mock.calls[0][0].content).toBe("COM_CONTENT");
  expect(insertComment.mock.calls[0][0].replies).toBeUndefined();
  expect(insertComment.mock.calls[0][1]).toBe("DEST_FILE_ID");
  expect(insertReply.mock.calls).toHaveLength(2);
  expect(insertReply.mock.calls[0][0].content).toBe(
    "*REPLY1_AUTH:*\nREPLY1_CONTENT",
  );
  expect(insertReply.mock.calls[0][1]).toBe("DEST_FILE_ID");
  expect(insertReply.mock.calls[0][2]).toBe("DEST_COM_ID");
  expect(insertReply.mock.calls[1][0].content).toBe("REPLY2_CONTENT");
  expect(insertReply.mock.calls[1][1]).toBe("DEST_FILE_ID");
  expect(insertReply.mock.calls[1][2]).toBe("DEST_COM_ID");
});
