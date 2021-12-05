import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { ErrorLogger_ } from "../utils/ErrorLogger";

function moveFolderContentsFiles_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  logger: ErrorLogger_
): void {
  for (const file of listFilesInFolder_(sourceID)) {
    moveFile_(file, sourceID, destinationID, path, copyComments, logger);
  }
}

function moveFolderContentsFolders_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean,
  logger: ErrorLogger_
): void {
  for (const folder of listFoldersInFolder_(sourceID)) {
    try {
      const destinationFolder = resolveDestinationFolder_(
        folder,
        destinationID,
        path,
        mergeFolders,
        logger
      );
      moveFolderContents_(
        folder.id!,
        destinationFolder.id!,
        path.concat([folder.title!]),
        copyComments,
        mergeFolders,
        logger
      );
      deleteFolderIfEmpty_(folder.id!);
    } catch (e) {
      logger.log(path.concat([folder.title!]), (e as Error).message);
    }
  }
}

export function moveFolderContents_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean,
  logger: ErrorLogger_
): void {
  moveFolderContentsFiles_(sourceID, destinationID, path, copyComments, logger);
  moveFolderContentsFolders_(
    sourceID,
    destinationID,
    path,
    copyComments,
    mergeFolders,
    logger
  );
}
