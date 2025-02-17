import { expect, test, vi } from "vitest";

import { listSharedDrives } from "../../src/backend/listSharedDrives";
import { SafeDriveService_ } from "../../src/backend/utils/SafeDriveService";
import { mockedSafeDriveService } from "./test-utils/SafeDriveService-stub";

vi.mock("../../src/backend/utils/SafeDriveService");

test("listSharedDrives works correctly", () => {
  interface ListDrivesOptions {
    maxResults?: number;
    orderBy?: string;
    pageToken?: string;
  }

  const response = [
    { id: "ID1", name: "DRIVE1" },
    { id: "ID2", name: "DRIVE2" },
  ];
  const rawResponse = {
    drives: response,
  };
  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Drives.list).mockReturnValueOnce(rawResponse);
  vi.mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  expect(listSharedDrives()).toStrictEqual({ response, status: "success" });

  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Drives.list).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Drives.list).mock.calls[0][1],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Drives.list).mock
        .calls[0][1] as ListDrivesOptions
    ).pageToken,
  ).toBeUndefined();
  expect(
    (
      vi.mocked(driveServiceMock.Drives.list).mock
        .calls[0][1] as ListDrivesOptions
    ).orderBy,
  ).toBe("name");
});

test("listSharedDrives handles Drive API error gracefully", () => {
  interface ListDrivesOptions {
    maxResults?: number;
    orderBy?: string;
    pageToken?: string;
  }

  const driveServiceMock = mockedSafeDriveService();
  vi.mocked(driveServiceMock.Drives.list).mockImplementationOnce(() => {
    throw new Error();
  });
  vi.mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  expect(listSharedDrives()).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });

  expect(vi.mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(vi.mocked(driveServiceMock.Drives.list).mock.calls).toHaveLength(1);
  expect(
    vi.mocked(driveServiceMock.Drives.list).mock.calls[0][1],
  ).toBeDefined();
  expect(
    (
      vi.mocked(driveServiceMock.Drives.list).mock
        .calls[0][1] as ListDrivesOptions
    ).pageToken,
  ).toBeUndefined();
  expect(
    (
      vi.mocked(driveServiceMock.Drives.list).mock
        .calls[0][1] as ListDrivesOptions
    ).orderBy,
  ).toBe("name");
});
