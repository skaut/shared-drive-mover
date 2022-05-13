import { listFilesInFolder_, listFoldersInFolder_ } from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { MoveContext } from "../../interfaces/MoveContext";
import type { MoveState_ } from "../utils/MoveState";

function moveFolderContentsFiles_(
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean
): void {
  const files = state.tryOrLog(context, () =>
    listFilesInFolder_(context.sourceID)
  );
  if (files === null) {
    return;
  }
  for (const file of files) {
    moveFile_(file, state, context, copyComments);
  }
}

export function moveFolder_(
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean,
  mergeFolders: boolean
): void {
  moveFolderContentsFiles_(state, context, copyComments);
  const subFolders = state.tryOrLog(context, () =>
    listFoldersInFolder_(context.sourceID)
  );
  if (subFolders !== null) {
    // TODO: Delete folders? (deleteFolderIfEmpty_)
    for (const folder of subFolders) {
      // TODO: Create destination folder later?
      const destinationFolder = resolveDestinationFolder_(
        folder,
        state,
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
  state.saveState();
}
