import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { ErrorLogger_ } from "../utils/ErrorLogger";
import type { MoveContext_ } from "../utils/MoveContext";
import type { MoveContextv2_ } from "../../interfaces/MoveContext";
import type { MoveState_ } from "../utils/MoveState";

function moveFolderContentsFiles_(
  context: MoveContextv2_,
  logger: ErrorLogger_,
  copyComments: boolean
): void {
  const files = logger.tryOrLog(context, () =>
    listFilesInFolder_(context.sourceID)
  );
  if (files === null) {
    return;
  }
  for (const file of files) {
    moveFile_(file, context, logger, copyComments);
  }
}

function moveFolderContentsFolders_(
  context: MoveContext_,
  copyComments: boolean,
  mergeFolders: boolean
): void {
  const subFolders = context.tryAndLog(() =>
    listFoldersInFolder_(context.sourceID)
  );
  if (subFolders === null) {
    return;
  }
  for (const folder of subFolders) {
    context.tryAndLog(() => {
      const destinationFolder = resolveDestinationFolder_(
        folder,
        context,
        mergeFolders
      );
      moveFolderContents_(
        context.childContext(folder.id!, destinationFolder.id!, folder.title!),
        copyComments,
        mergeFolders
      );
      deleteFolderIfEmpty_(folder.id!);
    }, folder.title);
  }
}

/*
export function moveFolderContents_(
  context: MoveContext_,
  copyComments: boolean,
  mergeFolders: boolean
): void {
  moveFolderContentsFiles_(context, copyComments);
  moveFolderContentsFolders_(context, copyComments, mergeFolders);
}
*/

export function moveFolder_(
  state: MoveState_,
  context: MoveContextv2_,
  logger: ErrorLogger_,
  copyComments: boolean,
  mergeFolders: boolean
): void {
  moveFolderContentsFiles_(context, logger, copyComments);
  const subFolders = logger.tryOrLog(context, () =>
    listFoldersInFolder_(context.sourceID)
  );
  if (subFolders !== null) {
    for (const folder of subFolders) {
      // TODO: Create destination folder later?
      const destinationFolder = resolveDestinationFolder_(
        folder,
        context,
        mergeFolders
      );
      state.addPath(
        folder.id!,
        destinationFolder.id!,
        context.path.concat([folder.title!])
      );
    }
  }
  state.removePath(context);
}
