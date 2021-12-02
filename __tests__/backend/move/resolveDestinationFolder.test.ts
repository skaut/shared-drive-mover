import { resolveDestinationFolder } from "../../../src/backend/move/resolveDestinationFolder";

test("resolveDestinationFolder works correctly", () => {
  /*
  interface User {
    displayName?: string;
    isAuthenticatedUser?: boolean;
  }
  interface CommentReply {
    author?: User;
    content?: string;
  }
  interface Comment {
    author?: User;
    commentId?: string;
    content?: string;
    replies?: Array<CommentReply>;
  }
  interface CommentList {
    items?: Array<Comment>;
    nextPageToken?: string;
  }
  interface ListCommentsOptions {
    maxResults?: number;
    pageToken?: string;
    fields?: string;
  }
  */
  interface ParentReference {
    id?: string;
  }
  interface File {
    mimeType?: string;
    parents?: Array<ParentReference>;
    title?: string;
  }
  interface InsertFileOptions {
    supportsAllDrives?: boolean;
    fields: string;
  }

  const insert = jest
    .fn<
      File,
      [resource: File, mediaData: any, optionalArgs: InsertFileOptions] // eslint-disable-line @typescript-eslint/no-explicit-any
    >()
    .mockReturnValueOnce({
      title: "NEWLY_CREATED_FOLDER",
    });
  global.Drive = {
    Files: {
      insert,
    },
  };

  expect(
    resolveDestinationFolder({}, "DEST_ID", ["PATH", "TO", "FOLDER"], false, [])
  ).toStrictEqual([{ title: "NEWLY_CREATED_FOLDER" }, undefined]);

  /*
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
  */
});
