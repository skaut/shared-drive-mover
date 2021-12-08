import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { MoveContext_ } from "../utils/MoveContext";

function moveFolderContentsFiles_(
  context: MoveContext_,
  copyComments: boolean
): void {
  for (const file of listFilesInFolder_(context.sourceID)) {
    moveFile_(file, context, copyComments);
  }
}

function moveFolderContentsFolders_(
  context: MoveContext_,
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
  context: MoveContext_,
  copyComments: boolean,
  mergeFolders: boolean
): void {
  moveFolderContentsFiles_(context, copyComments);
  moveFolderContentsFolders_(context, copyComments, mergeFolders);
}
