import { expect, test } from "@jest/globals";

import { copyFileComments_ } from "../../../src/backend/move/copyFileComments";
import { mockedSafeDriveService } from "../../test-utils/SafeDriveService-stub";

test("copyFileComments works correctly", () => {
  interface ListCommentsOptions {
    fields?: string;
    maxResults?: number;
    pageToken?: string;
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
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Comments.insert
    .mockReturnValueOnce({
      author: { displayName: "COM2_AUTH", isAuthenticatedUser: true },
      commentId: "DEST_COM1_ID",
      content: "*COM1_AUTH:*\nCOM1_CONTENT",
      replies: [],
    })
    .mockReturnValueOnce({
      author: { displayName: "COM2_AUTH", isAuthenticatedUser: true },
      commentId: "DEST_COM2_ID",
      content: "COM2_CONTENT",
      replies: [],
    });
  driveServiceMock.Comments.list.mockReturnValueOnce(rawResponse);

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID", driveServiceMock);

  expect(driveServiceMock.Comments.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Comments.list.mock.calls[0][0]).toBe("SRC_FILE_ID");
  expect(driveServiceMock.Comments.list.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Comments.list.mock.calls[0][1] as ListCommentsOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Comments.list.mock.calls[0][1] as ListCommentsOptions)
      .fields!.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
  expect(driveServiceMock.Comments.insert.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Comments.insert.mock.calls[0][0].content).toBe(
    "*COM1_AUTH:*\nCOM1_CONTENT",
  );
  expect(
    driveServiceMock.Comments.insert.mock.calls[0][0].replies,
  ).toStrictEqual([]);
  expect(driveServiceMock.Comments.insert.mock.calls[0][1]).toBe(
    "DEST_FILE_ID",
  );
  expect(driveServiceMock.Comments.insert.mock.calls[1][0].content).toBe(
    "COM2_CONTENT",
  );
  expect(
    driveServiceMock.Comments.insert.mock.calls[1][0].replies,
  ).toStrictEqual([]);
  expect(driveServiceMock.Comments.insert.mock.calls[1][1]).toBe(
    "DEST_FILE_ID",
  );
});

test("copyFileComments works correctly with replies", () => {
  interface ListCommentsOptions {
    fields?: string;
    maxResults?: number;
    pageToken?: string;
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
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Comments.insert.mockReturnValueOnce({
    author: { displayName: "COM_AUTH", isAuthenticatedUser: true },
    commentId: "DEST_COM_ID",
    content: "COM_CONTENT",
    replies: [],
  });
  driveServiceMock.Comments.list.mockReturnValueOnce(rawResponse);
  driveServiceMock.Replies.insert.mockReturnValueOnce({});

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID", driveServiceMock);

  expect(driveServiceMock.Comments.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Comments.list.mock.calls[0][0]).toBe("SRC_FILE_ID");
  expect(driveServiceMock.Comments.list.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Comments.list.mock.calls[0][1] as ListCommentsOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Comments.list.mock.calls[0][1] as ListCommentsOptions)
      .fields!.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
  expect(driveServiceMock.Comments.insert.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Comments.insert.mock.calls[0][0].content).toBe(
    "COM_CONTENT",
  );
  expect(
    driveServiceMock.Comments.insert.mock.calls[0][0].replies,
  ).toStrictEqual([]);
  expect(driveServiceMock.Comments.insert.mock.calls[0][1]).toBe(
    "DEST_FILE_ID",
  );
  expect(driveServiceMock.Replies.insert.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Replies.insert.mock.calls[0][0].content).toBe(
    "*REPLY1_AUTH:*\nREPLY1_CONTENT",
  );
  expect(driveServiceMock.Replies.insert.mock.calls[0][1]).toBe("DEST_FILE_ID");
  expect(driveServiceMock.Replies.insert.mock.calls[0][2]).toBe("DEST_COM_ID");
  expect(driveServiceMock.Replies.insert.mock.calls[1][0].content).toBe(
    "REPLY2_CONTENT",
  );
  expect(driveServiceMock.Replies.insert.mock.calls[1][1]).toBe("DEST_FILE_ID");
  expect(driveServiceMock.Replies.insert.mock.calls[1][2]).toBe("DEST_COM_ID");
});
