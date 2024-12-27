import { expect, test, vi } from "vitest";

import { copyFileComments_ } from "../../../src/backend/move/copyFileComments";
import { mockedSafeDriveService } from "../test-utils/SafeDriveService-stub";

test("copyFileComments works correctly", () => {
  interface ListCommentsOptions {
    fields?: string;
    maxResults?: number;
    pageToken?: string;
  }

  const rawResponse = {
    comments: [
      {
        author: { displayName: "COM1_AUTH", me: false },
        content: "COM1_CONTENT",
        id: "SRC_COM1_ID",
        replies: [],
      },
      {
        author: { displayName: "COM2_AUTH", me: true },
        content: "COM2_CONTENT",
        id: "SRC_COM2_ID",
        replies: [],
      },
    ],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Comments.create)
    .mockReturnValueOnce({
      author: { displayName: "COM2_AUTH", me: true },
      content: "*COM1_AUTH:*\nCOM1_CONTENT",
      id: "DEST_COM1_ID",
      replies: [],
    })
    .mockReturnValueOnce({
      author: { displayName: "COM2_AUTH", me: true },
      content: "COM2_CONTENT",
      id: "DEST_COM2_ID",
      replies: [],
    });
  vi.mocked(driveServiceMock.Comments.list).mockReturnValueOnce(rawResponse);

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID", driveServiceMock);

  expect(vi.mocked(driveServiceMock.Comments.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Comments.list).mock.calls[0][0]).toBe(
    "SRC_FILE_ID",
  );
  expect(
    vi.mocked(driveServiceMock.Comments.list).mock.calls[0][1],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Comments.list).mock
        .calls[0][1] as ListCommentsOptions
    ).pageToken,
  ).toBeUndefined();
  expect(
    (
      vi.mocked(driveServiceMock.Comments.list).mock
        .calls[0][1] as ListCommentsOptions
    ).fields,
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Comments.list).mock
        .calls[0][1] as ListCommentsOptions
    ).fields
      ?.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
  expect(vi.mocked(driveServiceMock.Comments.create).mock.calls).toHaveLength(
    2,
  );
  expect(
    vi.mocked(driveServiceMock.Comments.create).mock.calls[0][0].content,
  ).toBe("*COM1_AUTH:*\nCOM1_CONTENT");
  expect(
    vi.mocked(driveServiceMock.Comments.create).mock.calls[0][0].replies,
  ).toStrictEqual([]);
  expect(vi.mocked(driveServiceMock.Comments.create).mock.calls[0][1]).toBe(
    "DEST_FILE_ID",
  );
  expect(
    vi.mocked(driveServiceMock.Comments.create).mock.calls[1][0].content,
  ).toBe("COM2_CONTENT");
  expect(
    vi.mocked(driveServiceMock.Comments.create).mock.calls[1][0].replies,
  ).toStrictEqual([]);
  expect(vi.mocked(driveServiceMock.Comments.create).mock.calls[1][1]).toBe(
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
    comments: [
      {
        author: { displayName: "COM_AUTH", me: true },
        content: "COM_CONTENT",
        id: "SRC_COM_ID",
        replies: [
          {
            author: { displayName: "REPLY1_AUTH", me: false },
            content: "REPLY1_CONTENT",
          },
          {
            author: { displayName: "REPLY2_AUTH", me: true },
            content: "REPLY2_CONTENT",
          },
        ],
      },
    ],
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Comments.create).mockReturnValueOnce({
    author: { displayName: "COM_AUTH", me: true },
    content: "COM_CONTENT",
    id: "DEST_COM_ID",
    replies: [],
  });
  vi.mocked(driveServiceMock.Comments.list).mockReturnValueOnce(rawResponse);
  vi.mocked(driveServiceMock.Replies.create).mockReturnValueOnce({});

  copyFileComments_("SRC_FILE_ID", "DEST_FILE_ID", driveServiceMock);

  expect(vi.mocked(driveServiceMock.Comments.list).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Comments.list).mock.calls[0][0]).toBe(
    "SRC_FILE_ID",
  );
  expect(
    vi.mocked(driveServiceMock.Comments.list).mock.calls[0][1],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Comments.list).mock
        .calls[0][1] as ListCommentsOptions
    ).pageToken,
  ).toBeUndefined();
  expect(
    (
      vi.mocked(driveServiceMock.Comments.list).mock
        .calls[0][1] as ListCommentsOptions
    ).fields,
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Comments.list).mock
        .calls[0][1] as ListCommentsOptions
    ).fields
      ?.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
  expect(vi.mocked(driveServiceMock.Comments.create).mock.calls).toHaveLength(
    1,
  );
  expect(
    vi.mocked(driveServiceMock.Comments.create).mock.calls[0][0].content,
  ).toBe("COM_CONTENT");
  expect(
    vi.mocked(driveServiceMock.Comments.create).mock.calls[0][0].replies,
  ).toStrictEqual([]);
  expect(vi.mocked(driveServiceMock.Comments.create).mock.calls[0][1]).toBe(
    "DEST_FILE_ID",
  );
  expect(vi.mocked(driveServiceMock.Replies.create).mock.calls).toHaveLength(2);
  expect(
    vi.mocked(driveServiceMock.Replies.create).mock.calls[0][0].content,
  ).toBe("*REPLY1_AUTH:*\nREPLY1_CONTENT");
  expect(vi.mocked(driveServiceMock.Replies.create).mock.calls[0][1]).toBe(
    "DEST_FILE_ID",
  );
  expect(vi.mocked(driveServiceMock.Replies.create).mock.calls[0][2]).toBe(
    "DEST_COM_ID",
  );
  expect(
    vi.mocked(driveServiceMock.Replies.create).mock.calls[1][0].content,
  ).toBe("REPLY2_CONTENT");
  expect(vi.mocked(driveServiceMock.Replies.create).mock.calls[1][1]).toBe(
    "DEST_FILE_ID",
  );
  expect(vi.mocked(driveServiceMock.Replies.create).mock.calls[1][2]).toBe(
    "DEST_COM_ID",
  );
});
