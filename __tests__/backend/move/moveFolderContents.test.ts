import { mocked } from "ts-jest/utils";

import { moveFolderContents_ } from "../../../src/backend/move/moveFolderContents";

import { ErrorLogger_ } from "../../../src/backend/utils/ErrorLogger";
import * as folderManagement from "../../../src/backend/move/folderManagement";
import * as moveFile from "../../../src/backend/move/moveFile";
import * as resolveDestinationFolder from "../../../src/backend/move/resolveDestinationFolder";

jest.mock("../../../src/backend/utils/ErrorLogger");
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
  const logger = new ErrorLogger_();

  moveFolderContents_(
    {
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      path: ["PATH", "TO", "FOLDER"],
    },
    false,
    false,
    logger
  );

  expect(listFilesInFolder.mock.calls.length).toBe(1);
  expect(listFilesInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toStrictEqual("SRC_ID");
  expect(mocked(logger).log.mock.calls.length).toBe(0);
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
    .moveFile_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const logger = new ErrorLogger_();

  moveFolderContents_(
    {
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      path: ["PATH", "TO", "FOLDER"],
    },
    false,
    false,
    logger
  );

  expect(listFilesInFolder.mock.calls.length).toBe(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls.length).toBe(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1].sourceID).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[0][1].destinationID).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[0][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(moveFileFn.mock.calls[0][2]).toBe(false);
  expect(moveFileFn.mock.calls[0][3]).toBe(logger);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1].sourceID).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[1][1].destinationID).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[1][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(moveFileFn.mock.calls[1][2]).toBe(false);
  expect(moveFileFn.mock.calls[1][3]).toBe(logger);
  expect(mocked(logger).log.mock.calls.length).toBe(0);
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
    .resolveDestinationFolder_.mockReturnValueOnce({})
    .mockReturnValueOnce({});
  const logger = new ErrorLogger_();

  moveFolderContents_(
    {
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      path: ["PATH", "TO", "FOLDER"],
    },
    false,
    false,
    logger
  );

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
  expect(resolveDestinationFolderFn.mock.calls[0][1].sourceID).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1].destinationID).toBe(
    "DEST_ID"
  );
  expect(resolveDestinationFolderFn.mock.calls[0][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(logger);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1].sourceID).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1].destinationID).toBe(
    "DEST_ID"
  );
  expect(resolveDestinationFolderFn.mock.calls[1][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(logger);
  expect(deleteFolderIfEmpty.mock.calls.length).toBe(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
  expect(mocked(logger).log.mock.calls.length).toBe(0);
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
    .resolveDestinationFolder_.mockReturnValueOnce({})
    .mockReturnValueOnce({});
  const logger = new ErrorLogger_();

  moveFolderContents_(
    {
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      path: ["PATH", "TO", "FOLDER"],
    },
    false,
    false,
    logger
  );

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
  expect(resolveDestinationFolderFn.mock.calls[0][1].sourceID).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1].destinationID).toBe(
    "DEST_ID"
  );
  expect(resolveDestinationFolderFn.mock.calls[0][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(logger);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1].sourceID).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1].destinationID).toBe(
    "DEST_ID"
  );
  expect(resolveDestinationFolderFn.mock.calls[1][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(logger);
  expect(deleteFolderIfEmpty.mock.calls.length).toBe(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
  expect(mocked(logger).log.mock.calls.length).toBe(1);
  expect(mocked(logger).log.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER2_NAME",
  ]);
  expect(mocked(logger).log.mock.calls[0][1]).toBe("ERROR_MESSAGE");
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
    .moveFile_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const logger = new ErrorLogger_();

  moveFolderContents_(
    {
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      path: ["PATH", "TO", "FOLDER"],
    },
    true,
    false,
    logger
  );

  expect(listFilesInFolder.mock.calls.length).toBe(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls.length).toBe(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls.length).toBe(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1].sourceID).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[0][1].destinationID).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[0][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(moveFileFn.mock.calls[0][2]).toBe(true);
  expect(moveFileFn.mock.calls[0][3]).toBe(logger);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1].sourceID).toBe("SRC_ID");
  expect(moveFileFn.mock.calls[1][1].destinationID).toBe("DEST_ID");
  expect(moveFileFn.mock.calls[1][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(moveFileFn.mock.calls[1][2]).toBe(true);
  expect(moveFileFn.mock.calls[1][3]).toBe(logger);
  expect(mocked(logger).log.mock.calls.length).toBe(0);
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
    .resolveDestinationFolder_.mockReturnValueOnce({})
    .mockReturnValueOnce({});
  const logger = new ErrorLogger_();

  moveFolderContents_(
    {
      sourceID: "SRC_ID",
      destinationID: "DEST_ID",
      path: ["PATH", "TO", "FOLDER"],
    },
    false,
    true,
    logger
  );

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
  expect(resolveDestinationFolderFn.mock.calls[0][1].sourceID).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1].destinationID).toBe(
    "DEST_ID"
  );
  expect(resolveDestinationFolderFn.mock.calls[0][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toBe(true);
  expect(resolveDestinationFolderFn.mock.calls[0][3]).toBe(logger);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1].sourceID).toBe("SRC_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1].destinationID).toBe(
    "DEST_ID"
  );
  expect(resolveDestinationFolderFn.mock.calls[1][1].path).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toBe(true);
  expect(resolveDestinationFolderFn.mock.calls[1][3]).toBe(logger);
  expect(deleteFolderIfEmpty.mock.calls.length).toBe(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
  expect(mocked(logger).log.mock.calls.length).toBe(0);
});
