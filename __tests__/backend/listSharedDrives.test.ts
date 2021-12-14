import { listSharedDrives } from "../../src/backend/listSharedDrives";

test("listSharedDrives works correctly", () => {
  interface ListDrivesOptions {
    pageToken?: string;
    maxResults?: number;
    orderBy?: string;
    fields?: string;
  }

  const response = [
    { id: "ID1", name: "DRIVE1" },
    { id: "ID2", name: "DRIVE2" },
  ];
  const rawResponse = {
    items: response,
    nextPageToken: undefined,
  };
  const list = jest
    .fn<
      GoogleAppsScript.Drive.Schema.DriveList,
      [optionalArgs: ListDrivesOptions]
    >()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    Drives: {
      list,
    },
  };

  expect(listSharedDrives()).toStrictEqual(response);
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0].pageToken).toBeUndefined();
  expect(list.mock.calls[0][0].orderBy).toBe("name");
  expect(
    list.mock.calls[0][0].fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
});
