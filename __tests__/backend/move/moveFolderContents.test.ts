import { mocked } from "ts-jest/utils";

import { moveFolderContents_ } from "../../../src/backend/move/moveFolderContents";

import * as folderManagement from "../../../src/backend/move/folderManagement";
import * as moveFile from "../../../src/backend/move/moveFile";
import * as resolveDestinationFolder from "../../../src/backend/move/resolveDestinationFolder";

jest.mock("../../../src/backend/move/folderManagement");
jest.mock("../../../src/backend/move/moveFile");
jest.mock("../../../src/backend/move/resolveDestinationFolder");

test("moveFolderContents works correctly with an empty folder", () => {
  const listFilesInFolder = mocked(
    folderManagement
  ).listFilesInFolder_.mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(
    folderManagement
  ).listFoldersInFolder_.mockReturnValueOnce([]);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      false
    )
  ).toStrictEqual([]);

  expect(listFilesInFolder.mock.calls.length).toBe(1);
  expect(listFilesInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
});

test("moveFolderContents moves files correctly", () => {
  const listFilesInFolder = mocked(
    folderManagement
  ).listFilesInFolder_.mockReturnValueOnce([
    { id: "FILE1_ID" },
    { id: "FILE2_ID" },
  ]);
  const listFoldersInFolder = mocked(
    folderManagement
  ).listFoldersInFolder_.mockReturnValueOnce([]);
  const moveFileFn = mocked(moveFile)
    .moveFile_.mockReturnValueOnce(null)
    .mockReturnValueOnce(null);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      false
    )
  ).toStrictEqual([]);

  expect(listFilesInFolder.mock.calls.length).toBe(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls.length).toBe(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[0][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[0][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[0][4]).toBe(false);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[1][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[1][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[1][4]).toBe(false);
});

test("moveFolderContents handles errors when moving files gracefully", () => {
  const listFilesInFolder = mocked(
    folderManagement
  ).listFilesInFolder_.mockReturnValueOnce([
    { id: "FILE1_ID" },
    { id: "FILE2_ID" },
    { id: "FILE3_ID" },
    { id: "FILE4_ID" },
  ]);
  const listFoldersInFolder = mocked(
    folderManagement
  ).listFoldersInFolder_.mockReturnValueOnce([]);
  const error1 = {
    file: ["PATH", "TO", "FOLDER", "FILE_NAME1"],
    error: "ERROR_MESSAGE1",
  };
  const error2 = {
    file: ["PATH", "TO", "FOLDER", "FILE_NAME2"],
    error: "ERROR_MESSAGE2",
  };
  const moveFileFn = mocked(moveFile)
    .moveFile_.mockReturnValueOnce(error1)
    .mockReturnValueOnce(null)
    .mockReturnValueOnce(error2)
    .mockReturnValueOnce(null);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      false
    )
  ).toStrictEqual([error1, error2]);

  expect(listFilesInFolder.mock.calls.length).toBe(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls.length).toBe(4);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[0][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[0][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[0][4]).toBe(false);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[1][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[1][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[1][4]).toBe(false);
  expect(moveFileFn.mock.calls[2][0].id).toBe("FILE3_ID");
  expect(moveFileFn.mock.calls[2][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[2][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[2][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[2][4]).toBe(false);
  expect(moveFileFn.mock.calls[3][0].id).toBe("FILE4_ID");
  expect(moveFileFn.mock.calls[3][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[3][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[3][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[3][4]).toBe(false);
});

test("moveFolderContents moves folders correctly", () => {
  const deleteFolderIfEmpty = mocked(folderManagement)
    .deleteFolderIfEmpty_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const listFilesInFolder = mocked(folderManagement)
    .listFilesInFolder_.mockReturnValueOnce([])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(folderManagement)
    .listFoldersInFolder_.mockReturnValueOnce([
      { id: "SUBFOLDER1_ID" },
      { id: "SUBFOLDER2_ID" },
    ])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const resolveDestinationFolderFn = mocked(resolveDestinationFolder)
    .resolveDestinationFolder_.mockReturnValueOnce([{}, undefined])
    .mockReturnValueOnce([{}, undefined]);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      false
    )
  ).toStrictEqual([]);

  expect(listFilesInFolder.mock.calls.length).toBe(3);
  expect(listFilesInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls.length).toBe(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(false);
  expect(deleteFolderIfEmpty.mock.calls.length).toBe(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
});

test("moveFolderContents handles errors when resolving destination folder gracefully", () => {
  const deleteFolderIfEmpty = mocked(folderManagement)
    .deleteFolderIfEmpty_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const listFilesInFolder = mocked(folderManagement)
    .listFilesInFolder_.mockReturnValueOnce([])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(folderManagement)
    .listFoldersInFolder_.mockReturnValueOnce([
      { id: "SUBFOLDER1_ID" },
      { id: "SUBFOLDER2_ID" },
    ])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const resolveError = {
    file: ["PATH", "TO", "FOLDER", "FILE_NAME"],
    error: "ERROR_MESSAGE",
  };
  const resolveDestinationFolderFn = mocked(resolveDestinationFolder)
    .resolveDestinationFolder_.mockReturnValueOnce([{}, undefined])
    .mockReturnValueOnce([{}, resolveError]);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      false
    )
  ).toStrictEqual([resolveError]);

  expect(listFilesInFolder.mock.calls.length).toBe(3);
  expect(listFilesInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls.length).toBe(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(false);
  expect(deleteFolderIfEmpty.mock.calls.length).toBe(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
});

test("moveFolderContents handles error when deleting folder gracefully", () => {
  const deleteFolderIfEmpty = mocked(folderManagement)
    .deleteFolderIfEmpty_.mockReturnValueOnce()
    .mockImplementationOnce(() => {
      throw new Error("ERROR_MESSAGE");
    });
  const listFilesInFolder = mocked(folderManagement)
    .listFilesInFolder_.mockReturnValueOnce([])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(folderManagement)
    .listFoldersInFolder_.mockReturnValueOnce([
      { id: "SUBFOLDER1_ID", title: "SUBFOLDER1_NAME" },
      { id: "SUBFOLDER2_ID", title: "SUBFOLDER2_NAME" },
    ])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const resolveDestinationFolderFn = mocked(resolveDestinationFolder)
    .resolveDestinationFolder_.mockReturnValueOnce([{}, undefined])
    .mockReturnValueOnce([{}, undefined]);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      false
    )
  ).toStrictEqual([
    {
      file: ["PATH", "TO", "FOLDER", "SUBFOLDER2_NAME"],
      error: "ERROR_MESSAGE",
    },
  ]);

  expect(listFilesInFolder.mock.calls.length).toBe(3);
  expect(listFilesInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls.length).toBe(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(false);
  expect(deleteFolderIfEmpty.mock.calls.length).toBe(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
});

test("moveFolderContents passes copyComments correctly", () => {
  const listFilesInFolder = mocked(
    folderManagement
  ).listFilesInFolder_.mockReturnValueOnce([
    { id: "FILE1_ID" },
    { id: "FILE2_ID" },
  ]);
  const listFoldersInFolder = mocked(
    folderManagement
  ).listFoldersInFolder_.mockReturnValueOnce([]);
  const moveFileFn = mocked(moveFile)
    .moveFile_.mockReturnValueOnce(null)
    .mockReturnValueOnce(null);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      true,
      false
    )
  ).toStrictEqual([]);

  expect(listFilesInFolder.mock.calls.length).toBe(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls.length).toBe(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[0][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[0][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[0][4]).toBe(true);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[1][2]).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[1][3]).toStrictEqual(["PATH", "TO", "FOLDER"]);
  expect(moveFileFn.mock.calls[1][4]).toBe(true);
});

test("moveFolderContents passes mergeFolders correctly", () => {
  const deleteFolderIfEmpty = mocked(folderManagement)
    .deleteFolderIfEmpty_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const listFilesInFolder = mocked(folderManagement)
    .listFilesInFolder_.mockReturnValueOnce([])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const listFoldersInFolder = mocked(folderManagement)
    .listFoldersInFolder_.mockReturnValueOnce([
      { id: "SUBFOLDER1_ID" },
      { id: "SUBFOLDER2_ID" },
    ])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([]);
  const resolveDestinationFolderFn = mocked(resolveDestinationFolder)
    .resolveDestinationFolder_.mockReturnValueOnce([{}, undefined])
    .mockReturnValueOnce([{}, undefined]);

  expect(
    moveFolderContents_(
      "SRC_ID",
      "DEST_ID",
      ["PATH", "TO", "FOLDER"],
      false,
      true
    )
  ).toStrictEqual([]);

  expect(listFilesInFolder.mock.calls.length).toBe(3);
  expect(listFilesInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toStrictEqual("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toStrictEqual("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls.length).toBe(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(true);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toBe("DEST_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(true);
  expect(deleteFolderIfEmpty.mock.calls.length).toBe(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
});
