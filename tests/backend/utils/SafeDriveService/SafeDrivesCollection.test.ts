import { expect, test, vi } from "vitest";

import { SafeDrivesCollection_ } from "../../../../src/backend/utils/SafeDriveService/SafeDrivesCollection";
import { mockedDrive } from "../../test-utils/gas-stubs";

test("list works", () => {
  const driveList = {
    drives: [
      {
        id: "DRIVE1",
        name: "DRIVE1_NAME",
      },
      {
        id: "DRIVE2",
        name: "DRIVE2_NAME",
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Drives)
    .list.mockReturnValueOnce(driveList);

  expect(SafeDrivesCollection_.list(null)).toStrictEqual(driveList);

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("list works with optional parameters", () => {
  const driveList = {
    drives: [
      {
        id: "DRIVE1",
        name: "DRIVE1_NAME",
      },
      {
        id: "DRIVE2",
        name: "DRIVE2_NAME",
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Drives)
    .list.mockReturnValueOnce(driveList);

  const optionalArgs = {
    maxResults: 100,
    orderBy: "name",
    pageToken: "TOKEN",
  };

  expect(SafeDrivesCollection_.list(null, optionalArgs)).toStrictEqual(
    driveList,
  );

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual(optionalArgs);
});

test("list works with selective fields", () => {
  const driveList1 = {
    drives: [
      {
        name: "DRIVE1_NAME",
      },
      {
        name: "DRIVE2_NAME",
      },
    ],
  };
  const driveList2 = {
    drives: [
      {
        id: "DRIVE1",
        name: "DRIVE1_NAME",
      },
      {
        id: "DRIVE2",
        name: "DRIVE2_NAME",
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Drives)
    .list.mockReturnValueOnce(driveList1)
    .mockReturnValueOnce(driveList2);

  expect(SafeDrivesCollection_.list({ name: true })).toStrictEqual(driveList1);
  expect(SafeDrivesCollection_.list({ id: true, name: true })).toStrictEqual(
    driveList2,
  );

  expect(list.mock.calls).toHaveLength(2);
  expect(list.mock.calls[0][0]).toStrictEqual({
    fields: "nextPageToken, drives(name)",
  });
  expect(list.mock.calls[1][0]).toStrictEqual({
    fields: "nextPageToken, drives(id, name)",
  });
});

test("list throws an error on an invalid drive", () => {
  const driveList = {
    drives: [
      {
        name: "DRIVE1_NAME",
      },
      {
        name: "DRIVE2_NAME",
      },
    ],
  };

  global.Drive = mockedDrive();
  const list = vi
    .mocked(global.Drive.Drives)
    .list.mockReturnValueOnce(driveList);

  expect(() => SafeDrivesCollection_.list(null)).toThrow(
    "Drives.list: Drive list is not safe.",
  );

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});

test("list throws an error on an invalid drive list", () => {
  global.Drive = mockedDrive();
  const list = vi.mocked(global.Drive.Drives).list.mockReturnValueOnce({});

  expect(() => SafeDrivesCollection_.list(null)).toThrow(
    "Drives.list: Drive list is not safe.",
  );

  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toStrictEqual({});
});
