import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { MoveContext } from "../../interfaces/MoveContext";

function moveFolderContentsFiles_(
  context: MoveContext,
  copyComments: boolean
): void {
  for (const file of listFilesInFolder_(context.sourceID)) {
    moveFile_(file, context, copyComments);
  }
}

function moveFolderContentsFolders_(
  context: MoveContext,
  copyComments: boolean,
  mergeFolders: boolean
): void {
  for (const folder of listFoldersInFolder_(context.sourceID)) {
    try {
      const destinationFolder = resolveDestinationFolder_(
        folder,
        context,
        mergeFolders
      );
      moveFolderContents_(
        {
          sourceID: folder.id!,
          destinationID: destinationFolder.id!,
          path: context.path.concat([folder.title!]),
          logger: context.logger,
        },
        copyComments,
        mergeFolders
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
  mergeFolders: boolean
): void {
  moveFolderContentsFiles_(context, copyComments);
  moveFolderContentsFolders_(context, copyComments, mergeFolders);
}
