import { resolveDestinationFolder } from "../../../src/backend/move/resolveDestinationFolder";

test("resolveDestinationFolder corretly creates new folder", () => {
  interface ParentReference {
    id?: string;
  }
  interface File {
    id?: string;
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
      id: "NEWLY_CREATED_FOLDER_ID",
      title: "FOLDER_NAME",
    });
  global.Drive = {
    Files: {
      insert,
    },
  };

  expect(
    resolveDestinationFolder(
      { id: "SRC_FOLDER_ID", title: "FOLDER_NAME" },
      "DEST_PARENT_ID",
      ["PATH", "TO", "FOLDER"],
      false
    )
  ).toStrictEqual([
    { id: "NEWLY_CREATED_FOLDER_ID", title: "FOLDER_NAME" },
    undefined,
  ]);

  expect(insert.mock.calls.length).toBe(1);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder"
  );
  expect(insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "DEST_PARENT_ID" },
  ]);
  expect(insert.mock.calls[0][0].title).toBe("FOLDER_NAME");
  expect(insert.mock.calls[0][2].supportsAllDrives).toBe(true);
});
