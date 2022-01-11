import { mocked } from "jest-mock";

import { MoveContext_ } from "../../../src/backend/utils/MoveContext";
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

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );

  moveFolderContents_(context, false, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(mocked(context.logger).log.mock.calls).toHaveLength(0);
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

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );
  moveFolderContents_(context, false, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls).toHaveLength(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[0][2]).toBe(false);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[1][2]).toBe(false);
  expect(mocked(context.logger).log.mock.calls).toHaveLength(0);
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

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );

  moveFolderContents_(context, false, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(3);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls).toHaveLength(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toBe(false);
  expect(deleteFolderIfEmpty.mock.calls).toHaveLength(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
  expect(mocked(context.logger).log.mock.calls).toHaveLength(0);
});

test("moveFolderContents moves files correctly, even when listing folders throws", () => {
  const listFilesInFolder = mocked(
    folderManagement
  ).listFilesInFolder_.mockReturnValueOnce([
    { id: "FILE1_ID" },
    { id: "FILE2_ID" },
  ]);
  const listFoldersInFolder = mocked(
    folderManagement
  ).listFoldersInFolder_.mockImplementationOnce(() => {
    throw new Error("ERROR_MESSAGE");
  });
  const moveFileFn = mocked(moveFile)
    .moveFile_.mockReturnValueOnce()
    .mockReturnValueOnce();

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );
  moveFolderContents_(context, false, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls).toHaveLength(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[0][2]).toBe(false);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[1][2]).toBe(false);
  expect(mocked(context.logger).log.mock.calls).toHaveLength(1);
  expect(mocked(context.logger).log.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(mocked(context.logger).log.mock.calls[0][1]).toBe("ERROR_MESSAGE");
});

test("moveFolderContents moves folders correctly, even when listing files throws", () => {
  const deleteFolderIfEmpty = mocked(folderManagement)
    .deleteFolderIfEmpty_.mockReturnValueOnce()
    .mockReturnValueOnce();
  const listFilesInFolder = mocked(folderManagement)
    .listFilesInFolder_.mockImplementationOnce(() => {
      throw new Error("ERROR_MESSAGE");
    })
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

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );

  moveFolderContents_(context, false, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(3);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls).toHaveLength(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toBe(false);
  expect(deleteFolderIfEmpty.mock.calls).toHaveLength(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
  expect(mocked(context.logger).log.mock.calls).toHaveLength(1);
  expect(mocked(context.logger).log.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
  ]);
  expect(mocked(context.logger).log.mock.calls[0][1]).toBe("ERROR_MESSAGE");
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

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );

  moveFolderContents_(context, false, false, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(3);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls).toHaveLength(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toBe(false);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toBe(false);
  expect(deleteFolderIfEmpty.mock.calls).toHaveLength(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
  expect(mocked(context.logger).log.mock.calls).toHaveLength(1);
  expect(mocked(context.logger).log.mock.calls[0][0]).toStrictEqual([
    "PATH",
    "TO",
    "FOLDER",
    "SUBFOLDER2_NAME",
  ]);
  expect(mocked(context.logger).log.mock.calls[0][1]).toBe("ERROR_MESSAGE");
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

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );

  moveFolderContents_(context, false, true, false);

  expect(listFilesInFolder.mock.calls).toHaveLength(1);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(1);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(moveFileFn.mock.calls).toHaveLength(2);
  expect(moveFileFn.mock.calls[0][0].id).toBe("FILE1_ID");
  expect(moveFileFn.mock.calls[0][1]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[0][3]).toBe(true);
  expect(moveFileFn.mock.calls[1][0].id).toBe("FILE2_ID");
  expect(moveFileFn.mock.calls[1][1]).toStrictEqual(context);
  expect(moveFileFn.mock.calls[1][3]).toBe(true);
  expect(mocked(context.logger).log.mock.calls).toHaveLength(0);
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

  const context = new MoveContext_(
    "SRC_ID",
    "DEST_ID",
    ["PATH", "TO", "FOLDER"],
    new ErrorLogger_()
  );

  moveFolderContents_(context, false, false, true);

  expect(listFilesInFolder.mock.calls).toHaveLength(3);
  expect(listFilesInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFilesInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFilesInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(listFoldersInFolder.mock.calls).toHaveLength(3);
  expect(listFoldersInFolder.mock.calls[0][0]).toBe("SRC_ID");
  expect(listFoldersInFolder.mock.calls[1][0]).toBe("SUBFOLDER1_ID");
  expect(listFoldersInFolder.mock.calls[2][0]).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls).toHaveLength(2);
  expect(resolveDestinationFolderFn.mock.calls[0][0].id).toBe("SUBFOLDER1_ID");
  expect(resolveDestinationFolderFn.mock.calls[0][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[0][2]).toBe(true);
  expect(resolveDestinationFolderFn.mock.calls[1][0].id).toBe("SUBFOLDER2_ID");
  expect(resolveDestinationFolderFn.mock.calls[1][1]).toStrictEqual(context);
  expect(resolveDestinationFolderFn.mock.calls[1][2]).toBe(true);
  expect(deleteFolderIfEmpty.mock.calls).toHaveLength(2);
  expect(deleteFolderIfEmpty.mock.calls[0][0]).toBe("SUBFOLDER1_ID");
  expect(deleteFolderIfEmpty.mock.calls[1][0]).toBe("SUBFOLDER2_ID");
  expect(mocked(context.logger).log.mock.calls).toHaveLength(0);
});
