import { expect, test, vi } from "vitest";

import * as copyFileComments from "../../../src/backend/move/copyFileComments";
import { moveFile_ } from "../../../src/backend/move/moveFile";
import { MoveState_ } from "../../../src/backend/utils/MoveState";
import { mockedSafeDriveService } from "../test-utils/SafeDriveService-stub";

vi.mock("../../../src/backend/utils/MoveState");
vi.mock("../../../src/backend/move/copyFileComments");

test("moveFile works correctly with a file that can be moved directly", () => {
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.update).mockReturnValueOnce({});
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      name: "FILE_NAME",
    },
    state,
    {
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
      sourceID: "SRC_PARENT_ID",
    },
    false,
    driveServiceMock,
  );

  expect(vi.mocked(driveServiceMock.Files.update).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.update).mock.calls[0][1]).toContain(
    "SRC_FILE_ID",
  );
  expect(
    vi.mocked(driveServiceMock.Files.update).mock.calls[0][4],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).addParents,
  ).toContain("DEST_PARENT_ID");
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).removeParents,
  ).toContain("SRC_PARENT_ID");
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).supportsAllDrives,
  ).toBe(true);
});

test("moveFile works correctly with a file that can be moved out of drive, yet cannot be moved directly", () => {
  interface CopyFileOptions {
    fields?: string;
    supportsAllDrives?: boolean;
  }
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.copy).mockReturnValueOnce({
    id: "DEST_FILE_ID",
  });
  vi.mocked(driveServiceMock.Files.update).mockImplementation(() => {
    throw new Error();
  });
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  vi.mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      name: "FILE_NAME",
    },
    state,
    {
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
      sourceID: "SRC_PARENT_ID",
    },
    false,
    driveServiceMock,
  );

  expect(vi.mocked(driveServiceMock.Files.update).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.update).mock.calls[0][1]).toContain(
    "SRC_FILE_ID",
  );
  expect(
    vi.mocked(driveServiceMock.Files.update).mock.calls[0][4],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).addParents,
  ).toContain("DEST_PARENT_ID");
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).removeParents,
  ).toContain("SRC_PARENT_ID");
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).supportsAllDrives,
  ).toBe(true);
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].parents,
  ).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].parents?.[0],
  ).toBe("DEST_PARENT_ID");
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].name).toBe(
    "FILE_NAME",
  );
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][1]).toBe(
    "SRC_FILE_ID",
  );
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][2]).toBeDefined();
  expect(
    (vi.mocked(driveServiceMock.Files.copy).mock.calls[0][3] as CopyFileOptions)
      .supportsAllDrives,
  ).toBe(true);
});

test("moveFile works correctly with a file that cannot be moved out of drive", () => {
  interface CopyFileOptions {
    fields?: string;
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.copy).mockReturnValueOnce({
    id: "DEST_FILE_ID",
  });
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  vi.mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "SRC_FILE_ID",
      name: "FILE_NAME",
    },
    state,
    {
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
      sourceID: "SRC_PARENT_ID",
    },
    false,
    driveServiceMock,
  );

  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].parents,
  ).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].parents?.[0],
  ).toBe("DEST_PARENT_ID");
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].name).toBe(
    "FILE_NAME",
  );
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][1]).toBe(
    "SRC_FILE_ID",
  );
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][2]).toBeDefined();
  expect(
    (vi.mocked(driveServiceMock.Files.copy).mock.calls[0][3] as CopyFileOptions)
      .supportsAllDrives,
  ).toBe(true);
});

test("moveFile works correctly with a file that can be moved directly with comments", () => {
  interface UpdateFileOptions {
    addParents?: string;
    removeParents?: string;
    supportsAllDrives?: boolean;
  }

  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.update).mockReturnValueOnce({});
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    true,
    false,
    driveServiceMock,
  );

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      name: "FILE_NAME",
    },
    state,
    {
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
      sourceID: "SRC_PARENT_ID",
    },
    true,
    driveServiceMock,
  );

  expect(vi.mocked(driveServiceMock.Files.update).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Files.update).mock.calls[0][1]).toContain(
    "SRC_FILE_ID",
  );
  expect(
    vi.mocked(driveServiceMock.Files.update).mock.calls[0][4],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).addParents,
  ).toContain("DEST_PARENT_ID");
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).removeParents,
  ).toContain("SRC_PARENT_ID");
  expect(
    (
      vi.mocked(driveServiceMock.Files.update).mock
        .calls[0][4] as UpdateFileOptions
    ).supportsAllDrives,
  ).toBe(true);
});

test("moveFile works correctly with a file that cannot be moved out of drive with comments", () => {
  interface CopyFileOptions {
    fields?: string;
    supportsAllDrives?: boolean;
  }

  vi.mocked(copyFileComments).copyFileComments_.mockReturnValueOnce();
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.copy).mockReturnValueOnce({
    id: "DEST_FILE_ID",
  });
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    true,
    false,
    driveServiceMock,
  );
  vi.mocked(state).tryOrLog.mockImplementation((_, fn) => fn());

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: false },
      id: "SRC_FILE_ID",
      name: "FILE_NAME",
    },
    state,
    {
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
      sourceID: "SRC_PARENT_ID",
    },
    true,
    driveServiceMock,
  );

  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].parents,
  ).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].parents?.[0],
  ).toBe("DEST_PARENT_ID");
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][0].name).toBe(
    "FILE_NAME",
  );
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][1]).toBe(
    "SRC_FILE_ID",
  );
  expect(vi.mocked(driveServiceMock.Files.copy).mock.calls[0][2]).toBeDefined();
  expect(
    (vi.mocked(driveServiceMock.Files.copy).mock.calls[0][3] as CopyFileOptions)
      .supportsAllDrives,
  ).toBe(true);
  expect(vi.mocked(copyFileComments).copyFileComments_.mock.calls).toHaveLength(
    1,
  );
  expect(vi.mocked(copyFileComments).copyFileComments_.mock.calls[0][0]).toBe(
    "SRC_FILE_ID",
  );
  expect(vi.mocked(copyFileComments).copyFileComments_.mock.calls[0][1]).toBe(
    "DEST_FILE_ID",
  );
});

test("moveFile fails gracefully on error", () => {
  expect.assertions(1);

  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Files.copy).mockImplementation(() => {
    throw new Error("ERROR_MESAGE");
  });
  vi.mocked(driveServiceMock.Files.update).mockImplementation(() => {
    throw new Error("ERROR_MESAGE");
  });
  const state = new MoveState_(
    "SRC_BASE_ID",
    "DEST_BASE_ID",
    false,
    false,
    driveServiceMock,
  );
  vi.mocked(state).tryOrLog.mockImplementation((_, fn) => {
    expect(fn).toThrow("ERROR_MESAGE");

    return null;
  });

  moveFile_(
    {
      capabilities: { canMoveItemOutOfDrive: true },
      id: "SRC_FILE_ID",
      name: "FILE_NAME",
    },
    state,
    {
      destinationID: "DEST_PARENT_ID",
      path: ["PATH", "TO", "FILE"],
      sourceID: "SRC_PARENT_ID",
    },
    false,
    driveServiceMock,
  );
});
