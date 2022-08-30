import { expect, jest, test } from "@jest/globals";

import { mocked } from "jest-mock";

import {
  mockedDrive,
  mockedFilesCollection,
  mockedUtilities,
} from "../../test-utils/gas-stubs";

import { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";

test("DriveBackedValue constructs correctly", () => {
  const key = "SAVE_KEY";
  const key_encoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);

  expect(() => {
    new DriveBackedValue_(key);
  }).not.toThrow();
});

test("DriveBackedValue saves a value - the folder exists, the value exists", () => {
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
  mocked(global.Utilities).newBlob.mockReturnValueOnce(
    "BLOB" as unknown as GoogleAppsScript.Base.Blob
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
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);
  const insert =
    jest.fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        mediaData?: Blob
      ) => GoogleAppsScript.Drive.Schema.File
    >();
  const update =
    jest.fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
        mediaData?: Blob
      ) => GoogleAppsScript.Drive.Schema.File
    >();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      insert,
      update,
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
  expect(insert.mock.calls).toHaveLength(0);
  expect(update.mock.calls).toHaveLength(1);
  expect(update.mock.calls[0][1]).toBe("FILE_ID");
  expect(update.mock.calls[0][2]).toBe("BLOB");
  expect(mocked(global.Utilities).newBlob.mock.calls).toHaveLength(1);
  expect(mocked(global.Utilities).newBlob.mock.calls[0][0]).toBe(
    JSON.stringify("VALUE")
  );
  expect(mocked(global.Utilities).newBlob.mock.calls[0][1]).toBe(
    "application/json"
  );
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
  mocked(global.Utilities).newBlob.mockReturnValueOnce(
    "BLOB" as unknown as GoogleAppsScript.Base.Blob
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
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);
  const insert =
    jest.fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        mediaData?: Blob
      ) => GoogleAppsScript.Drive.Schema.File
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
  expect(mocked(global.Utilities).newBlob.mock.calls).toHaveLength(1);
  expect(mocked(global.Utilities).newBlob.mock.calls[0][0]).toBe(
    JSON.stringify("VALUE")
  );
  expect(mocked(global.Utilities).newBlob.mock.calls[0][1]).toBe(
    "application/json"
  );
});

test("DriveBackedValue saves a value - the folder doesn't exists", () => {
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
  mocked(global.Utilities).newBlob.mockReturnValueOnce(
    "BLOB" as unknown as GoogleAppsScript.Base.Blob
  );
  const response = {
    items: [],
  };
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response)
    .mockReturnValueOnce(response);
  const insert = jest
    .fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        mediaData?: Blob
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce({ id: "FOLDER_ID" });
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
  expect(insert.mock.calls).toHaveLength(2);
  expect(insert.mock.calls[0][0].mimeType).toBe(
    "application/vnd.google-apps.folder"
  );
  expect(insert.mock.calls[0][0].title).toBe("Shared drive mover cache");
  expect(insert.mock.calls[1][0].mimeType).toBe("application/json");
  expect(insert.mock.calls[1][0].parents).toStrictEqual([{ id: "FOLDER_ID" }]);
  expect(insert.mock.calls[1][0].title).toBe(
    "shared-drive-mover-state-" + key_sha256 + ".json"
  );
  expect(insert.mock.calls[1][1]).toBe("BLOB");
  expect(mocked(global.Utilities).newBlob.mock.calls).toHaveLength(1);
  expect(mocked(global.Utilities).newBlob.mock.calls[0][0]).toBe(
    JSON.stringify("VALUE")
  );
  expect(mocked(global.Utilities).newBlob.mock.calls[0][1]).toBe(
    "application/json"
  );
});

test("DriveBackedValue loads a value - the folder exists, the value exists", () => {
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

  interface GetFileOptions {
    alt?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
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
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);
  const get = jest
    .fn<
      (
        fileId: string,
        optionalArgs?: GetFileOptions
      ) => GoogleAppsScript.Drive.Schema.File
    >()
    .mockReturnValueOnce(
      // Incorrect upstream typings, string is actually permissible
      JSON.stringify("VALUE") as unknown as GoogleAppsScript.Drive.Schema.File
    );
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      get,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  expect(driveBackedValue.loadValue()).toBe("VALUE");
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
  expect(get.mock.calls).toHaveLength(1);
  expect(get.mock.calls[0][0]).toBe("FILE_ID");
  expect(get.mock.calls[0][1]).toBeDefined();
  expect(get.mock.calls[0][1]!.alt).toBe("media");
});

test("DriveBackedValue loads a value - the folder exists, the value doesn't", () => {
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
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
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2);
  const get = jest.fn<(fileId: string) => GoogleAppsScript.Drive.Schema.File>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      get,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  expect(driveBackedValue.loadValue()).toBeNull();
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
  expect(get.mock.calls).toHaveLength(0);
});

test("DriveBackedValue loads a value - the folder doesn't exist", () => {
  const key = "SAVE_KEY";
  const key_encoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];

  interface ListFilesOptions {
    q?: string;
    maxResults?: number;
    fields?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
  const response1 = {
    items: [],
  };
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1);
  const get = jest.fn<(fileId: string) => GoogleAppsScript.Drive.Schema.File>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      get,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  expect(driveBackedValue.loadValue()).toBeNull();
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.q).toContain(
    'title = "Shared drive mover cache"'
  );
  expect(list.mock.calls[0][0]!.q).toContain('"root" in parents');
  expect(list.mock.calls[0][0]!.q).toContain(
    'mimeType = "application/vnd.google-apps.folder"'
  );
  expect(list.mock.calls[0][0]!.q).toContain("trashed = false");
  expect(get.mock.calls).toHaveLength(0);
});

test("DriveBackedValue deletes a value - the folder exists, the value exists, the folder doesn't contain other files", () => {
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
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
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);
  const remove = jest.fn<(fileId: string) => void>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      remove,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  driveBackedValue.deleteValue();
  expect(list.mock.calls).toHaveLength(3);
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
  expect(list.mock.calls[2][0]).toBeDefined();
  expect(list.mock.calls[2][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[2][0]!.q).toContain("trashed = false");
  expect(remove.mock.calls).toHaveLength(2);
  expect(remove.mock.calls[0][0]).toBe("FILE_ID");
  expect(remove.mock.calls[1][0]).toBe("FOLDER_ID");
});

test("DriveBackedValue deletes a value - the folder exists, the value exists, the folder contains other files", () => {
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
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
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);
  const remove = jest.fn<(fileId: string) => void>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      remove,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  driveBackedValue.deleteValue();
  expect(list.mock.calls).toHaveLength(3);
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
  expect(list.mock.calls[2][0]).toBeDefined();
  expect(list.mock.calls[2][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[2][0]!.q).toContain("trashed = false");
  expect(remove.mock.calls).toHaveLength(1);
  expect(remove.mock.calls[0][0]).toBe("FILE_ID");
});

test("DriveBackedValue deletes a value - the folder exists, the value doesn't, the folder doesn't contain other files", () => {
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
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
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);
  const remove = jest.fn<(fileId: string) => void>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      remove,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  driveBackedValue.deleteValue();
  expect(list.mock.calls).toHaveLength(3);
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
  expect(list.mock.calls[2][0]).toBeDefined();
  expect(list.mock.calls[2][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[2][0]!.q).toContain("trashed = false");
  expect(remove.mock.calls).toHaveLength(1);
  expect(remove.mock.calls[0][0]).toBe("FOLDER_ID");
});

test("DriveBackedValue deletes a value - the folder exists, the value doesn't, the folder contains other files", () => {
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

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
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
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response1)
    .mockReturnValueOnce(response2)
    .mockReturnValueOnce(response3);
  const remove = jest.fn<(fileId: string) => void>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      remove,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  driveBackedValue.deleteValue();
  expect(list.mock.calls).toHaveLength(3);
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
  expect(list.mock.calls[2][0]).toBeDefined();
  expect(list.mock.calls[2][0]!.q).toContain('"FOLDER_ID" in parents');
  expect(list.mock.calls[2][0]!.q).toContain("trashed = false");
  expect(remove.mock.calls).toHaveLength(0);
});

test("DriveBackedValue deletes a value - the folder doesn't exist", () => {
  const key = "SAVE_KEY";
  const key_encoded = [
    -76, -53, -80, -84, 55, -67, -130, -109, -47, -51, -121, -16, 32, -38, -79,
    -84, 39, 117, -92, 2, 113, -101, 76, 81, -129, 93, 109, 104, 116, -115, 37,
    16,
  ];

  interface ListFilesOptions {
    q?: string;
    maxResults?: number;
    fields?: string;
  }

  global.Utilities = mockedUtilities();
  mocked(global.Utilities).computeDigest.mockReturnValueOnce(key_encoded);
  const response = {
    items: [],
  };
  const list = jest
    .fn<
      (
        optionalArgs?: ListFilesOptions
      ) => GoogleAppsScript.Drive.Schema.FileList
    >()
    .mockReturnValueOnce(response);
  const remove = jest.fn<(fileId: string) => void>();
  global.Drive = {
    ...mockedDrive(),
    Files: {
      ...mockedFilesCollection(),
      list,
      remove,
    },
  };

  const driveBackedValue = new DriveBackedValue_(key);
  driveBackedValue.deleteValue();
  expect(list.mock.calls).toHaveLength(1);
  expect(list.mock.calls[0][0]).toBeDefined();
  expect(list.mock.calls[0][0]!.q).toContain(
    'title = "Shared drive mover cache"'
  );
  expect(list.mock.calls[0][0]!.q).toContain('"root" in parents');
  expect(list.mock.calls[0][0]!.q).toContain(
    'mimeType = "application/vnd.google-apps.folder"'
  );
  expect(list.mock.calls[0][0]!.q).toContain("trashed = false");
  expect(remove.mock.calls).toHaveLength(0);
});
