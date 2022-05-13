import { listFilesInFolder_, listFoldersInFolder_ } from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { ErrorLogger_ } from "../utils/ErrorLogger";
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
    // TODO: Delete folders? (deleteFolderIfEmpty_)
    for (const folder of subFolders) {
      // TODO: Create destination folder later?
      const destinationFolder = resolveDestinationFolder_(
        folder,
        context,
        logger,
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
