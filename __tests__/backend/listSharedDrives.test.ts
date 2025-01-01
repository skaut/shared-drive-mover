import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import { listSharedDrives } from "../../src/backend/listSharedDrives";
import { SafeDriveService_ } from "../../src/backend/utils/SafeDriveService";
import { mockedSafeDriveService } from "../test-utils/SafeDriveService-stub";

jest.mock<{ SafeDriveService_: jest.Mock }>(
  "../../src/backend/utils/SafeDriveService",
  () => ({
    SafeDriveService_: jest.fn(),
  }),
);

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
    items: response,
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Drives.list.mockReturnValueOnce(rawResponse);
  mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  expect(listSharedDrives()).toStrictEqual({ response, status: "success" });

  expect(mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][1] as ListDrivesOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][1] as ListDrivesOptions)
      .orderBy,
  ).toBe("name");
});

test("listSharedDrives handles Drive API error gracefully", () => {
  interface ListDrivesOptions {
    maxResults?: number;
    orderBy?: string;
    pageToken?: string;
  }

  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Drives.list.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(SafeDriveService_).mockReturnValueOnce(driveServiceMock);

  expect(listSharedDrives()).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });

  expect(mocked(SafeDriveService_).mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][1] as ListDrivesOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][1] as ListDrivesOptions)
      .orderBy,
  ).toBe("name");
});
