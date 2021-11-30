import { mocked } from "ts-jest/utils";

import { moveFile } from "../../../src/backend/move/moveFile";

import * as copyFileComments from "../../../src/backend/move/copyFileComments";

jest.mock("../../../src/backend/move/copyFileComments");

test("moveFile works correctly with a file that can be moved directly", () => {
  interface FileCapabilities {
    canMoveItemOutOfDrive?: boolean;
  }
  interface File {
    capabilities?: FileCapabilities;
    id?: string;
    title?: string;
  }
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const update = jest
    .fn<
      File,
      [
        resource: File,
        fileId: string,
        mediaData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs: UpdateFileOptions
      ]
    >()
    .mockReturnValueOnce({});
  global.Drive = {
    Files: {
      update,
    },
  };

  expect(
    moveFile(
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FILE_ID",
        title: "FILE_NAME",
      },
      "SRC_PARENT_ID",
      "DEST_PARENT_ID",
      ["PATH", "TO", "FILE"],
      false
    )
  ).toBeNull();

  expect(update.mock.calls.length).toBe(1);
  expect(update.mock.calls[0][1]).toContain("SRC_FILE_ID");
  expect(update.mock.calls[0][3].addParents).toContain("DEST_PARENT_ID");
  expect(update.mock.calls[0][3].removeParents).toContain("SRC_PARENT_ID");
  expect(update.mock.calls[0][3].supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that can be moved out of drive, yet cannot be moved directly", () => {
  interface FileCapabilities {
    canMoveItemOutOfDrive?: boolean;
  }
  interface ParentReference {
    id?: string;
  }
  interface File {
    capabilities?: FileCapabilities;
    id?: string;
    parents?: Array<ParentReference>;
    title?: string;
  }
  interface CopyFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const copy = jest
    .fn<File, [resource: File, fileId: string, optionalArgs: CopyFileOptions]>()
    .mockReturnValueOnce({});
  const update = jest
    .fn<
      File,
      [
        resource: File,
        fileId: string,
        mediaData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs: UpdateFileOptions
      ]
    >()
    .mockImplementation(() => {
      throw new Error();
    });
  global.Drive = {
    Files: {
      copy,
      update,
    },
  };

  expect(
    moveFile(
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FILE_ID",
        title: "FILE_NAME",
      },
      "SRC_PARENT_ID",
      "DEST_PARENT_ID",
      ["PATH", "TO", "FILE"],
      false
    )
  ).toBeNull();

  expect(update.mock.calls.length).toBe(1);
  expect(update.mock.calls[0][1]).toContain("SRC_FILE_ID");
  expect(update.mock.calls[0][3].addParents).toContain("DEST_PARENT_ID");
  expect(update.mock.calls[0][3].removeParents).toContain("SRC_PARENT_ID");
  expect(update.mock.calls[0][3].supportsAllDrives).toBe(true);
  expect(copy.mock.calls.length).toBe(1);
  expect(copy.mock.calls[0][0].parents!.length).toBe(1);
  expect(copy.mock.calls[0][0].parents![0].id).toBe("DEST_PARENT_ID");
  expect(copy.mock.calls[0][0].title).toBe("FILE_NAME");
  expect(copy.mock.calls[0][1]).toBe("SRC_FILE_ID");
  expect(copy.mock.calls[0][2].supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that cannot be moved out of drive", () => {
  interface FileCapabilities {
    canMoveItemOutOfDrive?: boolean;
  }
  interface ParentReference {
    id?: string;
  }
  interface File {
    capabilities?: FileCapabilities;
    id?: string;
    parents?: Array<ParentReference>;
    title?: string;
  }
  interface CopyFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const copy = jest
    .fn<File, [resource: File, fileId: string, optionalArgs: CopyFileOptions]>()
    .mockReturnValueOnce({});
  global.Drive = {
    Files: {
      copy,
    },
  };

  expect(
    moveFile(
      {
        capabilities: { canMoveItemOutOfDrive: false },
        id: "SRC_FILE_ID",
        title: "FILE_NAME",
      },
      "SRC_PARENT_ID",
      "DEST_PARENT_ID",
      ["PATH", "TO", "FILE"],
      false
    )
  ).toBeNull();

  expect(copy.mock.calls.length).toBe(1);
  expect(copy.mock.calls[0][0].parents!.length).toBe(1);
  expect(copy.mock.calls[0][0].parents![0].id).toBe("DEST_PARENT_ID");
  expect(copy.mock.calls[0][0].title).toBe("FILE_NAME");
  expect(copy.mock.calls[0][1]).toBe("SRC_FILE_ID");
  expect(copy.mock.calls[0][2].supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that can be moved directly with comments", () => {
  interface FileCapabilities {
    canMoveItemOutOfDrive?: boolean;
  }
  interface File {
    capabilities?: FileCapabilities;
    id?: string;
    title?: string;
  }
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const update = jest
    .fn<
      File,
      [
        resource: File,
        fileId: string,
        mediaData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs: UpdateFileOptions
      ]
    >()
    .mockReturnValueOnce({});
  global.Drive = {
    Files: {
      update,
    },
  };

  expect(
    moveFile(
      {
        capabilities: { canMoveItemOutOfDrive: true },
        id: "SRC_FILE_ID",
        title: "FILE_NAME",
      },
      "SRC_PARENT_ID",
      "DEST_PARENT_ID",
      ["PATH", "TO", "FILE"],
      true
    )
  ).toBeNull();

  expect(update.mock.calls.length).toBe(1);
  expect(update.mock.calls[0][1]).toContain("SRC_FILE_ID");
  expect(update.mock.calls[0][3].addParents).toContain("DEST_PARENT_ID");
  expect(update.mock.calls[0][3].removeParents).toContain("SRC_PARENT_ID");
  expect(update.mock.calls[0][3].supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that cannot be moved out of drive with comments", () => {
  interface FileCapabilities {
    canMoveItemOutOfDrive?: boolean;
  }
  interface ParentReference {
    id?: string;
  }
  interface File {
    capabilities?: FileCapabilities;
    id?: string;
    parents?: Array<ParentReference>;
    title?: string;
  }
  interface CopyFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const copy = jest
    .fn<File, [resource: File, fileId: string, optionalArgs: CopyFileOptions]>()
    .mockReturnValueOnce({id: "DEST_FILE_ID"});
  global.Drive = {
    Files: {
      copy,
    },
  };
  mocked(copyFileComments).copyFileComments.mockReturnValueOnce();

  expect(
    moveFile(
      {
        capabilities: { canMoveItemOutOfDrive: false },
        id: "SRC_FILE_ID",
        title: "FILE_NAME",
      },
      "SRC_PARENT_ID",
      "DEST_PARENT_ID",
      ["PATH", "TO", "FILE"],
      true
    )
  ).toBeNull();

  expect(copy.mock.calls.length).toBe(1);
  expect(copy.mock.calls[0][0].parents!.length).toBe(1);
  expect(copy.mock.calls[0][0].parents![0].id).toBe("DEST_PARENT_ID");
  expect(copy.mock.calls[0][0].title).toBe("FILE_NAME");
  expect(copy.mock.calls[0][1]).toBe("SRC_FILE_ID");
  expect(copy.mock.calls[0][2].supportsAllDrives).toBe(true);
  expect(mocked(copyFileComments).copyFileComments.mock.calls.length).toBe(1);
  expect(mocked(copyFileComments).copyFileComments.mock.calls[0][0]).toBe(
    "SRC_FILE_ID"
  );
  expect(mocked(copyFileComments).copyFileComments.mock.calls[0][1]).toBe(
    "DEST_FILE_ID"
  );
});
