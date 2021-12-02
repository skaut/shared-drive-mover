import { listSharedDrives } from "../../src/backend/listSharedDrives";

test("listSharedDrives works correctly", () => {
  interface Drive {
    id?: string;
    name?: string;
  }
  interface DriveList {
    items?: Array<Drive>;
    nextPageToken?: string;
  }
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
    .fn<DriveList, [optionalArgs: ListDrivesOptions]>()
    .mockReturnValueOnce(rawResponse);
  global.Drive = {
    Drives: {
      list,
    },
  };

  expect(listSharedDrives()).toStrictEqual(response);
  expect(list.mock.calls.length).toBe(1);
  expect(list.mock.calls[0][0].pageToken).toBe(undefined);
  expect(list.mock.calls[0][0].orderBy).toBe("name");
  expect(
    list.mock.calls[0][0].fields!.split(",").map((s) => s.trim())
  ).toContain("nextPageToken");
});
