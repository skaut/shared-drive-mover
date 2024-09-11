import { expect, jest, test } from "@jest/globals";

import { SafeCommentsCollection_ } from "../../../../src/backend/utils/SafeDriveService/SafeCommentsCollection";
import {
  mockedCommentsCollection,
  mockedDrive,
} from "../../../test-utils/gas-stubs";

test("SafeCommentsCollection constructs correctly", () => {
  global.Drive = {
    ...mockedDrive(),
    Comments: mockedCommentsCollection(),
  };

  expect(() => {
    new SafeCommentsCollection_();
  }).not.toThrow();
});

test("SafeCommentsCollection throws an error without the Comments collection", () => {
  global.Drive = {
    ...mockedDrive(),
  };

  expect(() => {
    new SafeCommentsCollection_();
  }).toThrow("");
});

test("insert works", () => {
  const comment = {
    author: {
      displayName: "COMMENT_AUTHOR",
      isAuthenticatedUser: false,
    },
    commentId: "COMMENT1",
    content: "COMMENT_CONTENT",
    replies: [
      {
        author: {
          displayName: "REPLY_AUTHOR",
          isAuthenticatedUser: false,
        },
        content: "REPLY_CONTENT",
      },
    ],
  };

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.Comment,
        fileId: string,
      ) => GoogleAppsScript.Drive.Schema.Comment
    >()
    .mockReturnValueOnce(comment);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      insert,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  expect(commentsCollection.insert(comment, "FILE_ID")).toStrictEqual(comment);

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(comment);
  expect(insert.mock.calls[0][1]).toBe("FILE_ID");
});

test("insert throws an error on an invalid comment", () => {
  const comment = {
    author: {
      displayName: "COMMENT_AUTHOR",
      isAuthenticatedUser: false,
    },
    commentId: "COMMENT1",
    replies: [
      {
        author: {
          displayName: "REPLY_AUTHOR",
          isAuthenticatedUser: false,
        },
        content: "REPLY_CONTENT",
      },
    ],
  };

  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.Comment,
        fileId: string,
      ) => GoogleAppsScript.Drive.Schema.Comment
    >()
    .mockReturnValueOnce(comment);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      insert,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  expect(() => commentsCollection.insert(comment, "FILE_ID")).toThrow("");

  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0]).toBe(comment);
  expect(insert.mock.calls[0][1]).toBe("FILE_ID");
});

test("list works", () => {
  const commentList = {
    items: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT1",
        content: "COMMENT1_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY1_CONTENT",
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT2",
        content: "COMMENT2_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          fields?: string;
          maxResults?: number;
          pageToken?: string | undefined;
        },
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(commentList);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  expect(commentsCollection.list("FILE_ID")).toStrictEqual(commentList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({});
});

test("list works with optional arguments", () => {
  const commentList = {
    items: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT1",
        content: "COMMENT1_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY1_CONTENT",
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT2",
        content: "COMMENT2_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          fields?: string;
          maxResults?: number;
          pageToken?: string | undefined;
        },
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(commentList);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  const optionalArgs = {
    fields: "items(id)",
    maxResults: 100,
    pageToken: "TOKEN",
  };

  expect(commentsCollection.list("FILE_ID", optionalArgs)).toStrictEqual(
    commentList,
  );

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toBe(optionalArgs);
});

test("list throws an error on an invalid comment", () => {
  const commentList = {
    items: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT1",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY1_CONTENT",
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT2",
        content: "COMMENT2_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          fields?: string;
          maxResults?: number;
          pageToken?: string | undefined;
        },
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(commentList);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  expect(() => commentsCollection.list("FILE_ID")).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({});
});

test("list throws an error on an invalid comment list", () => {
  const commentList = {
    nextPageToken: "TOKEN",
  };

  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          fields?: string;
          maxResults?: number;
          pageToken?: string | undefined;
        },
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(commentList);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  expect(() => commentsCollection.list("FILE_ID")).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({});
});

test("list throws an error on missing replies", () => {
  const commentList = {
    items: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT1",
        content: "COMMENT1_CONTENT",
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT2",
        content: "COMMENT2_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          fields?: string;
          maxResults?: number;
          pageToken?: string | undefined;
        },
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(commentList);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  expect(() => commentsCollection.list("FILE_ID")).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({});
});

test("list throws an error on an invalid reply", () => {
  const commentList = {
    items: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT1",
        content: "COMMENT1_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          isAuthenticatedUser: false,
        },
        commentId: "COMMENT2",
        content: "COMMENT2_CONTENT",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              isAuthenticatedUser: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  const list = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: {
          fields?: string;
          maxResults?: number;
          pageToken?: string | undefined;
        },
      ) => GoogleAppsScript.Drive.Schema.CommentList
    >()
    .mockReturnValueOnce(commentList);
  global.Drive = {
    ...mockedDrive(),
    Comments: {
      ...mockedCommentsCollection(),
      list,
    },
  };

  const commentsCollection = new SafeCommentsCollection_();

  expect(() => commentsCollection.list("FILE_ID")).toThrow("");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({});
});
