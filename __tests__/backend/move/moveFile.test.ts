import { mocked } from "jest-mock";

import { moveFile_ } from "../../../src/backend/move/moveFile";

import { MoveState_ } from "../../../src/backend/utils/MoveState";
import * as copyFileComments from "../../../src/backend/move/copyFileComments";
import { mockedDrive, mockedFilesCollection } from "../../test-utils/gas-stubs";

jest.mock("../../../src/backend/utils/MoveState");
jest.mock("../../../src/backend/move/copyFileComments");

test("moveFile works correctly with a file that can be moved directly", () => {
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const update = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: UpdateFileOptions
      ]
    >()
    .mockReturnValueOnce({});
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      update,
    },
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      title: "FILE_NAME",
    },
    state,
    {
      sourceID: "SRC_PARENT_ID",
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
    },
    false
  );

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][1]).toContain("SRC_FILE_ID");
  expect(update.mock.calls[0][3]).toBeDefined();
  expect(update.mock.calls[0][3]!.addParents).toContain("DEST_PARENT_ID");
  expect(update.mock.calls[0][3]!.removeParents).toContain("SRC_PARENT_ID");
  expect(update.mock.calls[0][3]!.supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that can be moved out of drive, yet cannot be moved directly", () => {
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
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: CopyFileOptions
      ]
    >()
    .mockReturnValueOnce({});
  const update = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: UpdateFileOptions
      ]
    >()
    .mockImplementation(() => {
      throw new Error();
    });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
      update,
    },
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      title: "FILE_NAME",
    },
    state,
    {
      sourceID: "SRC_PARENT_ID",
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
    },
    false
  );

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][1]).toContain("SRC_FILE_ID");
  expect(update.mock.calls[0][3]).toBeDefined();
  expect(update.mock.calls[0][3]!.addParents).toContain("DEST_PARENT_ID");
  expect(update.mock.calls[0][3]!.removeParents).toContain("SRC_PARENT_ID");
  expect(update.mock.calls[0][3]!.supportsAllDrives).toBe(true);
  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0].parents!).toHaveLength(1);
  expect(copy.mock.calls[0][0].parents![0].id).toBe("DEST_PARENT_ID");
  expect(copy.mock.calls[0][0].title).toBe("FILE_NAME");
  expect(copy.mock.calls[0][1]).toBe("SRC_FILE_ID");
  expect(copy.mock.calls[0][2]).toBeDefined();
  expect(copy.mock.calls[0][2]!.supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that cannot be moved out of drive", () => {
  interface CopyFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const copy = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: CopyFileOptions
      ]
    >()
    .mockReturnValueOnce({});
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
    },
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "SRC_FILE_ID",
      title: "FILE_NAME",
    },
    state,
    {
      sourceID: "SRC_PARENT_ID",
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
    },
    false
  );

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0].parents!).toHaveLength(1);
  expect(copy.mock.calls[0][0].parents![0].id).toBe("DEST_PARENT_ID");
  expect(copy.mock.calls[0][0].title).toBe("FILE_NAME");
  expect(copy.mock.calls[0][1]).toBe("SRC_FILE_ID");
  expect(copy.mock.calls[0][2]).toBeDefined();
  expect(copy.mock.calls[0][2]!.supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that can be moved directly with comments", () => {
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const update = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: UpdateFileOptions
      ]
    >()
    .mockReturnValueOnce({});
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      update,
    },
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", true, false);

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      title: "FILE_NAME",
    },
    state,
    {
      sourceID: "SRC_PARENT_ID",
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
    },
    true
  );

  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][1]).toContain("SRC_FILE_ID");
  expect(update.mock.calls[0][3]).toBeDefined();
  expect(update.mock.calls[0][3]!.addParents).toContain("DEST_PARENT_ID");
  expect(update.mock.calls[0][3]!.removeParents).toContain("SRC_PARENT_ID");
  expect(update.mock.calls[0][3]!.supportsAllDrives).toBe(true);
});

test("moveFile works correctly with a file that cannot be moved out of drive with comments", () => {
  interface CopyFileOptions {
    supportsAllDrives?: boolean;
    fields?: string;
  }

  const copy = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: CopyFileOptions
      ]
    >()
    .mockReturnValueOnce({ id: "DEST_FILE_ID" });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
    },
  };
  mocked(copyFileComments).copyFileComments_.mockReturnValueOnce();
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", true, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "SRC_FILE_ID",
      title: "FILE_NAME",
    },
    state,
    {
      sourceID: "SRC_PARENT_ID",
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
    },
    true
  );

  expect(copy.mock.calls).toHaveLength(1);
  expect(copy.mock.calls[0][0].parents!).toHaveLength(1);
  expect(copy.mock.calls[0][0].parents![0].id).toBe("DEST_PARENT_ID");
  expect(copy.mock.calls[0][0].title).toBe("FILE_NAME");
  expect(copy.mock.calls[0][1]).toBe("SRC_FILE_ID");
  expect(copy.mock.calls[0][2]).toBeDefined();
  expect(copy.mock.calls[0][2]!.supportsAllDrives).toBe(true);
  expect(mocked(copyFileComments).copyFileComments_.mock.calls).toHaveLength(1);
  expect(mocked(copyFileComments).copyFileComments_.mock.calls[0][0]).toBe(
    "SRC_FILE_ID"
  );
  expect(mocked(copyFileComments).copyFileComments_.mock.calls[0][1]).toBe(
    "DEST_FILE_ID"
  );
});

test("moveFile fails gracefully on error", () => {
  expect.assertions(1);
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
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        optionalArgs?: CopyFileOptions
      ]
    >()
    .mockImplementation(() => {
      throw new Error("ERROR_MESAGE");
    });
  const update = jest
    .fn<
      GoogleAppsScript.Drive.Schema.File,
      [
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        mediaData?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        optionalArgs?: UpdateFileOptions
      ]
    >()
    .mockImplementation(() => {
      throw new Error("ERROR_MESAGE");
    });
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      copy,
      update,
    },
  };
  const state = new MoveState_("SRC_BASE_ID", "DEST_BASE_ID", false, false);
  mocked(state).tryOrLog.mockImplementation((_, fn) => {
    expect(fn).toThrow("ERROR_MESAGE");
  });

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      title: "FILE_NAME",
    },
    state,
    {
      sourceID: "SRC_PARENT_ID",
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
    },
    false
  );
});
