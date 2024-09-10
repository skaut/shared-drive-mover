import { expect, test } from "@jest/globals";
import { mocked } from "jest-mock";

import { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";
import { mockedUtilities } from "../../test-utils/gas-stubs";
import { mockedSafeDriveService } from "../../test-utils/SafeDriveService-stub";

test("DriveBackedValue constructs correctly", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  const driveServiceMock = mockedSafeDriveService();

  expect(() => {
    new DriveBackedValue_(key, driveServiceMock);
  }).not.toThrow();
});

test("DriveBackedValue saves a value - the folder exists, the value exists", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  mocked(global.Utilities).newBlob.mockReturnValueOnce(
    "BLOB" as unknown as GoogleAppsScript.Base.Blob,
  );
  const response1 = {
    items: [
      {
        id: "FOLDER_ID",
      },
    ],
  };
  const response2 = {
    items: [
      {
        id: "FILE_ID",
      },
    ],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.saveValue("VALUE");

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(0);
  expect(driveServiceMock.Files.update.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.update.mock.calls[0][1]).toBe("FILE_ID");
  expect(driveServiceMock.Files.update.mock.calls[0][2]).toBe("BLOB");
  expect(mocked(global.Utilities).newBlob.mock.calls).toHaveLength(1);
  expect(mocked(global.Utilities).newBlob.mock.calls[0][0]).toBe(
    JSON.stringify("VALUE"),
  );
  expect(mocked(global.Utilities).newBlob.mock.calls[0][1]).toBe(
    "application/json",
  );
});

test("DriveBackedValue saves a value - the folder exists, the value doesn't", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  mocked(global.Utilities).newBlob.mockReturnValueOnce(
    "BLOB" as unknown as GoogleAppsScript.Base.Blob,
  );
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
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.saveValue("VALUE");

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].mimeType).toBe(
    "application/json",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][0].parents).toStrictEqual([
    { id: "FOLDER_ID" },
  ]);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].title).toBe(
    `shared-drive-mover-state-${keySha256}.json`,
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][2]).toBe("BLOB");
  expect(mocked(global.Utilities).newBlob.mock.calls).toHaveLength(1);
  expect(mocked(global.Utilities).newBlob.mock.calls[0][0]).toBe(
    JSON.stringify("VALUE"),
  );
  expect(mocked(global.Utilities).newBlob.mock.calls[0][1]).toBe(
    "application/json",
  );
});

test("DriveBackedValue saves a value - the folder doesn't exists", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  mocked(global.Utilities).newBlob.mockReturnValueOnce(
    "BLOB" as unknown as GoogleAppsScript.Base.Blob,
  );
  const response = {
    items: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.insert.mockReturnValueOnce({ id: "FOLDER_ID" });
  driveServiceMock.Files.list
    .mockReturnValueOnce(response)
    .mockReturnValueOnce(response);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.saveValue("VALUE");

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.insert.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Files.insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder",
  );
  expect(driveServiceMock.Files.insert.mock.calls[0][0].title).toBe(
    "Shared drive mover cache",
  );
  expect(driveServiceMock.Files.insert.mock.calls[1][0].mimeType).toBe(
    "application/json",
  );
  expect(driveServiceMock.Files.insert.mock.calls[1][0].parents).toStrictEqual([
    { id: "FOLDER_ID" },
  ]);
  expect(driveServiceMock.Files.insert.mock.calls[1][0].title).toBe(
    `shared-drive-mover-state-${keySha256}.json`,
  );
  expect(driveServiceMock.Files.insert.mock.calls[1][2]).toBe("BLOB");
  expect(mocked(global.Utilities).newBlob.mock.calls).toHaveLength(1);
  expect(mocked(global.Utilities).newBlob.mock.calls[0][0]).toBe(
    JSON.stringify("VALUE"),
  );
  expect(mocked(global.Utilities).newBlob.mock.calls[0][1]).toBe(
    "application/json",
  );
});

test("DriveBackedValue loads a value - the folder exists, the value exists", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  interface GetFileOptions {
    alt?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  const response1 = {
    items: [
      {
        id: "FOLDER_ID",
      },
    ],
  };
  const response2 = {
    items: [
      {
        id: "FILE_ID",
      },
    ],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.get.mockReturnValueOnce(
    // Incorrect upstream typings, string is actually permissible
    JSON.stringify("VALUE") as unknown as GoogleAppsScript.Drive.Schema.File,
  );
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);

  expect(driveBackedValue.loadValue()).toBe("VALUE");
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.get.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.get.mock.calls[0][0]).toBe("FILE_ID");
  expect(driveServiceMock.Files.get.mock.calls[0][1]).toBeDefined();
  expect(
    (driveServiceMock.Files.get.mock.calls[0][2] as GetFileOptions).alt,
  ).toBe("media");
});

test("DriveBackedValue loads a value - the folder exists, the value doesn't", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
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
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);

  expect(driveBackedValue.loadValue()).toBeNull();
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.get.mock.calls).toHaveLength(0);
});

test("DriveBackedValue loads a value - the folder doesn't exist", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  const response1 = {
    items: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(response1);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);

  expect(driveBackedValue.loadValue()).toBeNull();
  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.get.mock.calls).toHaveLength(0);
});

test("DriveBackedValue deletes a value - the folder exists, the value exists, the folder doesn't contain other files", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  const response1 = {
    items: [
      {
        id: "FOLDER_ID",
      },
    ],
  };
  const response2 = {
    items: [
      {
        id: "FILE_ID",
      },
    ],
  };
  const response3 = {
    items: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.deleteValue();

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(3);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[2][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(2);
  expect(driveServiceMock.Files.remove.mock.calls[0][0]).toBe("FILE_ID");
  expect(driveServiceMock.Files.remove.mock.calls[1][0]).toBe("FOLDER_ID");
});

test("DriveBackedValue deletes a value - the folder exists, the value exists, the folder contains other files", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  const response1 = {
    items: [
      {
        id: "FOLDER_ID",
      },
    ],
  };
  const response2 = {
    items: [
      {
        id: "FILE_ID",
      },
    ],
  };
  const response3 = {
    items: [
      {
        id: "OTHER_FILE_ID",
      },
    ],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.deleteValue();

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(3);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[2][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.remove.mock.calls[0][0]).toBe("FILE_ID");
});

test("DriveBackedValue deletes a value - the folder exists, the value doesn't, the folder doesn't contain other files", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
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
  const response3 = {
    items: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.deleteValue();

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(3);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[2][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.remove.mock.calls[0][0]).toBe("FOLDER_ID");
});

test("DriveBackedValue deletes a value - the folder exists, the value doesn't, the folder contains other files", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];
  const keySha256 =
    "b4cbb0ac37bd7e93d1cd87f020dab1ac2775a402719b4c517f5d6d68748d2510";

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
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
  const response3 = {
    items: [
      {
        id: "OTHER_FILE_ID",
      },
    ],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.deleteValue();

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(3);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[1][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain(`title = "shared-drive-mover-state-${keySha256}.json"`);
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[1][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.list.mock.calls[2][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain('"FOLDER_ID" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[2][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(0);
});

test("DriveBackedValue deletes a value - the folder doesn't exist", () => {
  const key = "SAVE_KEY";
  const keyEncoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];

  interface ListFilesOptions {
    fields?: string;
    maxResults?: number;
    q?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(keyEncoded);
  const response = {
    items: [],
  };
  const driveServiceMock = mockedSafeDriveService();
  driveServiceMock.Files.list.mockReturnValueOnce(response);

  const driveBackedValue = new DriveBackedValue_(key, driveServiceMock);
  driveBackedValue.deleteValue();

  expect(driveServiceMock.Files.list.mock.calls).toHaveLength(1);
  expect(driveServiceMock.Files.list.mock.calls[0][0]).toBeDefined();
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('title = "Shared drive mover cache"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('"root" in parents');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain('mimeType = "application/vnd.google-apps.folder"');
  expect(
    (driveServiceMock.Files.list.mock.calls[0][0] as ListFilesOptions).q,
  ).toContain("trashed = false");
  expect(driveServiceMock.Files.remove.mock.calls).toHaveLength(0);
});
