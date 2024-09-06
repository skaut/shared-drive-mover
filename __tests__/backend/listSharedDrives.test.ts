import { expect, jest, test } from "@jest/globals";
import { mocked } from "jest-mock";

import { listSharedDrives } from "../../src/backend/listSharedDrives";
import { DriveService_ } from "../../src/backend/utils/DriveService";
import { mockedDriveService } from "../test-utils/DriveService-stub";

/* eslint-disable @typescript-eslint/naming-convention -- Properties are mock classes */
jest.mock<{ DriveService_: jest.Mock }>(
  "../../src/backend/utils/DriveService",
  () => ({
    DriveService_: jest.fn(),
  }),
);
/* eslint-enable */

test("listSharedDrives works correctly", () => {
  interface ListDrivesOptions {
    fields?: string;
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
    nextPageToken: undefined,
  };
  const driveServiceMock = mockedDriveService();
  driveServiceMock.Drives.list.mockReturnValueOnce(rawResponse);
  mocked(DriveService_).mockReturnValueOnce(driveServiceMock);

  expect(listSharedDrives()).toStrictEqual({ response, status: "success" });

  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][0] as ListDrivesOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][0] as ListDrivesOptions)
      .orderBy,
  ).toBe("name");
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][0] as ListDrivesOptions)
      .fields!.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
});

test("listSharedDrives handles Drive API error gracefully", () => {
  interface ListDrivesOptions {
    fields?: string;
    maxResults?: number;
    orderBy?: string;
    pageToken?: string;
  }

  const driveServiceMock = mockedDriveService();
  driveServiceMock.Drives.list.mockImplementationOnce(() => {
    throw new Error();
  });
  mocked(DriveService_).mockReturnValueOnce(driveServiceMock);

  expect(listSharedDrives()).toStrictEqual({
    status: "error",
    type: "DriveAPIError",
  });

  expect(mocked(DriveService_).mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Drives.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][0] as ListDrivesOptions)
      .pageToken,
  ).toBeUndefined();
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][0] as ListDrivesOptions)
      .orderBy,
  ).toBe("name");
  expect(
    (driveServiceMock.Drives.list.mock.calls[0][0] as ListDrivesOptions)
      .fields!.split(",")
      .map((s) => s.trim()),
  ).toContain("nextPageToken");
});
