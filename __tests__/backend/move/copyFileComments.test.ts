import { copyFileComments_ } from "../../../src/backend/move/copyFileComments";

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
      GoogleAppsScript.Drive.Schema.CommentList,
      [fileId: string, optionalArgs: ListCommentsOptions]
    >()
    .mockReturnValueOnce(rawResponse);
  const insert = jest
    .fn<
      GoogleAppsScript.Drive.Schema.Comment,
      [resource: GoogleAppsScript.Drive.Schema.Comment, fileId: string]
    >()
    .mockReturnValueOnce({
      commentId: "DEST_COM1_ID",
    })
    .mockReturnValueOnce({
      commentId: "DEST_COM2_ID",
    });
  global.Drive = {
    Comments: {
      list,
      insert,
    },
  };

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID");

  expect(list.mock.calls.length).toBe(1);
  expect(list.mock.calls[0][0]).toBe("SRC_FILE_ID");
  expect(list.mock.calls[0][1].pageToken).toBe(undefined);
  expect(
    list.mock.calls[0][1].fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
  expect(insert.mock.calls.length).toBe(2);
  expect(insert.mock.calls[0][0].content).toBe("*COM1_AUTH:*\nCOM1_CONTENT");
  expect(insert.mock.calls[0][0].replies).toBe(undefined);
  expect(insert.mock.calls[0][1]).toBe("DEST_FILE_ID");
  expect(insert.mock.calls[1][0].content).toBe("COM2_CONTENT");
  expect(insert.mock.calls[1][0].replies).toBe(undefined);
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
      GoogleAppsScript.Drive.Schema.CommentList,
      [fileId: string, optionalArgs: ListCommentsOptions]
    >()
    .mockReturnValueOnce(rawResponse);
  const insertComment = jest
    .fn<
      GoogleAppsScript.Drive.Schema.Comment,
      [resource: GoogleAppsScript.Drive.Schema.Comment, fileId: string]
    >()
    .mockReturnValueOnce({
      commentId: "DEST_COM_ID",
    });
  const insertReply = jest
    .fn<
      GoogleAppsScript.Drive.Schema.CommentReply,
      [
        resource: GoogleAppsScript.Drive.Schema.CommentReply,
        fileId: string,
        commentId: string
      ]
    >()
    .mockReturnValueOnce({});
  global.Drive = {
    Comments: {
      list,
      insert: insertComment,
    },
    Replies: {
      insert: insertReply,
    },
  };

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID");

  expect(list.mock.calls.length).toBe(1);
  expect(list.mock.calls[0][0]).toBe("SRC_FILE_ID");
  expect(list.mock.calls[0][1].pageToken).toBe(undefined);
  expect(
    list.mock.calls[0][1].fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
  expect(insertComment.mock.calls.length).toBe(1);
  expect(insertComment.mock.calls[0][0].content).toBe("COM_CONTENT");
  expect(insertComment.mock.calls[0][0].replies).toBe(undefined);
  expect(insertComment.mock.calls[0][1]).toBe("DEST_FILE_ID");
  expect(insertReply.mock.calls.length).toBe(2);
  expect(insertReply.mock.calls[0][0].content).toBe(
    "*REPLY1_AUTH:*\nREPLY1_CONTENT"
  );
  expect(insertReply.mock.calls[0][1]).toBe("DEST_FILE_ID");
  expect(insertReply.mock.calls[0][2]).toBe("DEST_COM_ID");
  expect(insertReply.mock.calls[1][0].content).toBe("REPLY2_CONTENT");
  expect(insertReply.mock.calls[1][1]).toBe("DEST_FILE_ID");
  expect(insertReply.mock.calls[1][2]).toBe("DEST_COM_ID");
});
