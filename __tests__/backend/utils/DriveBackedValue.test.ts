import { mockedDrive, mockedFilesCollection } from "../../test-utils/gas-stubs";

import { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";

test("DriveBackedValue constructs correctly", () => {
  const key = "SAVE_KEY";
  const key_encoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  //const key_sha256 = "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  global.Utilities = {
    computeDigest: jest.fn().mockReturnValueOnce(key_encoded),
    Charset: {
      US_ASCII: "TEST_US_ASCII_CONST",
    },
    DigestAlgorithm: {
      SHA_256: "TEST_SHA_256_CONST",
    },
  };

  expect(() => {
    new DriveBackedValue_(key);
  }).not.toThrow();
});

test("DriveBackedValue saves a value - the folder exists, the value doesn't", () => {
  const key = "SAVE_KEY";
  const key_encoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const key_sha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    q?: string;
    maxResults?: number;
    fields?: string;
  }

  // Return type should actually be Blob, but that's hard to create reliably.
  const newBlob = jest
    .fn<string, [data: string, contentType?: string]>()
    .mockReturnValueOnce("BLOB");
  global.Utilities = {
    computeDigest: jest.fn().mockReturnValueOnce(key_encoded),
    newBlob,
    Charset: {
      US_ASCII: "TEST_US_ASCII_CONST",
    },
    DigestAlgorithm: {
      SHA_256: "TEST_SHA_256_CONST",
    },
  };
  const response1 = {
    items: [
      {
        id: "FOLDER_ID",
      },
    ],
  };
  const response2 = {
    items: [],
  };
  const list = jest
    .fn<
      GoogleAppsScript.Drive.Schema.FileList,
      [optionalArgs?: ListFilesOptions]
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);
  const insert = jest.fn<
    GoogleAppsScript.Drive.Schema.File,
    [resource: GoogleAppsScript.Drive.Schema.File, mediaData: Blob]
  >();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      insert,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  driveBackedValue.saveValue("VALUE");
  expect(list.mock.calls).toHaveLength(2);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.q).toContain(
    'title = "Shared drive mover cache"'
  );
  expect(list.mock.calls[0][0]!.q).toContain('"root" in parents');
  expect(list.mock.calls[0][0]!.q).toContain(
    'mimeType = "application/vnd.google-apps.folder"'
  );
  expect(list.mock.calls[0][0]!.q).toContain("trashed = false");
  expect(list.mock.calls[1][0]).toBeDefined();
  expect(list.mock.calls[1][0]!.q).toContain(
    'title = "shared-drive-mover-state-' + key_sha256 + '.json"'
  );
  expect(list.mock.calls[1][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[1][0]!.q).toContain("trashed = false");
  expect(insert.mock.calls).toHaveLength(1);
  expect(insert.mock.calls[0][0].mimeType).toBe("application/json");
  expect(insert.mock.calls[0][0].parents).toStrictEqual([{ id: "FOLDER_ID" }]);
  expect(insert.mock.calls[0][0].title).toBe(
    "shared-drive-mover-state-" + key_sha256 + ".json"
  );
  expect(insert.mock.calls[0][1]).toBe("BLOB");
  expect(newBlob.mock.calls).toHaveLength(1);
  expect(newBlob.mock.calls[0][0]).toBe(JSON.stringify("VALUE"));
  expect(newBlob.mock.calls[0][1]).toBe("application/json");
});
