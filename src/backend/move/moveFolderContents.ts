import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { ErrorLogger_ } from "../utils/ErrorLogger";
import type { MoveContext } from "../../interfaces/MoveContext";

function moveFolderContentsFiles_(
  context: MoveContext,
  copyComments: boolean,
  logger: ErrorLogger_
): void {
  for (const file of listFilesInFolder_(context.sourceID)) {
    moveFile_(file, context, copyComments, logger);
  }
}

function moveFolderContentsFolders_(
  context: MoveContext,
  copyComments: boolean,
  mergeFolders: boolean,
  logger: ErrorLogger_
): void {
  for (const folder of listFoldersInFolder_(context.sourceID)) {
    try {
      const destinationFolder = resolveDestinationFolder_(
        folder,
        context,
        mergeFolders,
        logger
      );
      moveFolderContents_(
        {
          sourceID: folder.id!,
          destinationID: destinationFolder.id!,
          path: context.path.concat([folder.title!]),
        },
        copyComments,
        mergeFolders,
        logger
      );
      deleteFolderIfEmpty_(folder.id!);
    } catch (e) {
      logger.log(context.path.concat([folder.title!]), (e as Error).message);
    }
  }
}

export function moveFolderContents_(
  context: MoveContext,
  copyComments: boolean,
  mergeFolders: boolean,
  logger: ErrorLogger_
): void {
  moveFolderContentsFiles_(context, copyComments, logger);
  moveFolderContentsFolders_(context, copyComments, mergeFolders, logger);
}
