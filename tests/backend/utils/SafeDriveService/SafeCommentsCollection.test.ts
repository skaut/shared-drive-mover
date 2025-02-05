import { expect, test, vi } from "vitest";

import { SafeCommentsCollection_ } from "../../../../src/backend/utils/SafeDriveService/SafeCommentsCollection";
import { mockedDrive } from "../../test-utils/gas-stubs";

test("create works", () => {
  const comment = {
    author: {
      displayName: "COMMENT_AUTHOR",
      me: false,
    },
    content: "COMMENT_CONTENT",
    id: "COMMENT1",
    replies: [
      {
        author: {
          displayName: "REPLY_AUTHOR",
          me: false,
        },
        content: "REPLY_CONTENT",
      },
    ],
  };

  global.Drive = mockedDrive();
  const create = vi
    .mocked(global.Drive.Comments)
    .create.mockReturnValueOnce(comment);

  expect(
    SafeCommentsCollection_.create(comment, "FILE_ID", {
      author: true,
      content: true,
      id: true,
      replies: true,
    }),
  ).toStrictEqual(comment);

  expect(create.mock.calls).toHaveLength(1);
  expect(create.mock.calls[0][0]).toBe(comment);
  expect(create.mock.calls[0][1]).toBe("FILE_ID");
});

test("create throws an error on an invalid comment", () => {
  const comment = {
    author: {
      displayName: "COMMENT_AUTHOR",
      me: false,
    },
    id: "COMMENT1",
    replies: [
      {
        author: {
          displayName: "REPLY_AUTHOR",
          me: false,
        },
        content: "REPLY_CONTENT",
      },
    ],
  };

  global.Drive = mockedDrive();
  const create = vi
    .mocked(global.Drive.Comments)
    .create.mockReturnValueOnce(comment);

  expect(() =>
    SafeCommentsCollection_.create(comment, "FILE_ID", {
      author: true,
      content: true,
      id: true,
      replies: true,
    }),
  ).toThrow("Comments.create: Comment is not safe.");

  expect(create.mock.calls).toHaveLength(1);
  expect(create.mock.calls[0][0]).toBe(comment);
  expect(create.mock.calls[0][1]).toBe("FILE_ID");
});

test("list works", () => {
  const commentList = {
    comments: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT1_CONTENT",
        id: "COMMENT1",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY1_CONTENT",
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT2_CONTENT",
        id: "COMMENT2",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Comments)
    .list.mockReturnValueOnce(commentList);

  expect(
    SafeCommentsCollection_.list("FILE_ID", {
      author: true,
      content: true,
      id: true,
      replies: true,
    }),
  ).toStrictEqual(commentList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({
    fields: "nextPageToken, comments(author, content, id, replies)",
  });
});

test("list works with optional arguments", () => {
  const commentList = {
    comments: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT1_CONTENT",
        id: "COMMENT1",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY1_CONTENT",
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT2_CONTENT",
        id: "COMMENT2",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Comments)
    .list.mockReturnValueOnce(commentList);

  const optionalArgs = {
    maxResults: 100,
    pageToken: "TOKEN",
  };

  expect(
    SafeCommentsCollection_.list("FILE_ID", { id: true }, optionalArgs),
  ).toStrictEqual(commentList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({
    ...optionalArgs,
    fields: "nextPageToken, comments(id)",
  });
});

test("list throws an error on an invalid comment", () => {
  const commentList = {
    comments: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        id: "COMMENT1",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY1_CONTENT",
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT2_CONTENT",
        id: "COMMENT2",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Comments)
    .list.mockReturnValueOnce(commentList);

  expect(() =>
    SafeCommentsCollection_.list("FILE_ID", {
      author: true,
      content: true,
      id: true,
      replies: true,
    }),
  ).toThrow("Comments.list: Comment list is not safe.");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({
    fields: "nextPageToken, comments(author, content, id, replies)",
  });
});

test("list throws an error on an invalid comment list", () => {
  const commentList = {
    nextPageToken: "TOKEN",
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Comments)
    .list.mockReturnValueOnce(commentList);

  expect(() =>
    SafeCommentsCollection_.list("FILE_ID", {
      author: true,
      content: true,
      id: true,
      replies: true,
    }),
  ).toThrow("Comments.list: Comment list is not safe.");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({
    fields: "nextPageToken, comments(author, content, id, replies)",
  });
});

test("list throws an error on missing replies", () => {
  const commentList = {
    comments: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT1_CONTENT",
        id: "COMMENT1",
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT2_CONTENT",
        id: "COMMENT2",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Comments)
    .list.mockReturnValueOnce(commentList);

  expect(() =>
    SafeCommentsCollection_.list("FILE_ID", {
      author: true,
      content: true,
      id: true,
      replies: true,
    }),
  ).toThrow("Comments.list: Comment list is not safe.");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({
    fields: "nextPageToken, comments(author, content, id, replies)",
  });
});

test("list throws an error on an invalid reply", () => {
  const commentList = {
    comments: [
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT1_CONTENT",
        id: "COMMENT1",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
          },
        ],
      },
      {
        author: {
          displayName: "COMMENT1_AUTHOR",
          me: false,
        },
        content: "COMMENT2_CONTENT",
        id: "COMMENT2",
        replies: [
          {
            author: {
              displayName: "REPLY_AUTHOR",
              me: false,
            },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Comments)
    .list.mockReturnValueOnce(commentList);

  expect(() =>
    SafeCommentsCollection_.list("FILE_ID", {
      author: true,
      content: true,
      id: true,
      replies: true,
    }),
  ).toThrow("Comments.list: Comment list is not safe.");

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBe("FILE_ID");
  expect(list.mock.calls[0][1]).toStrictEqual({
    fields: "nextPageToken, comments(author, content, id, replies)",
  });
});
