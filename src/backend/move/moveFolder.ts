import type { MoveContext } from "../../interfaces/MoveContext";
import type { DriveService_ } from "../utils/DriveService";
import type { MoveState_ } from "../utils/MoveState";

import { listFilesInFolder_, listFoldersInFolder_ } from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

function moveFolderContentsFiles_(
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean,
  driveService: DriveService_,
): void {
  const files = state.tryOrLog(context, () =>
    listFilesInFolder_(context.sourceID),
  );
  if (files === null) {
    return;
  }
  for (const file of files) {
    moveFile_(file, state, context, copyComments, driveService);
  }
}

export function moveFolder_(
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean,
  mergeFolders: boolean,
  driveService: DriveService_,
): void {
  moveFolderContentsFiles_(state, context, copyComments, driveService);
  const subFolders = state.tryOrLog(context, () =>
    listFoldersInFolder_(context.sourceID),
  );
  if (subFolders !== null) {
    for (const folder of subFolders) {
      const destinationFolder = resolveDestinationFolder_(
        folder,
        state,
        context,
        mergeFolders,
        driveService,
      );
      state.addPath(
        folder.id!,
        destinationFolder.id!,
        context.path.concat([folder.title!]),
      );
    }
  }
  state.removePath(context);
  state.saveState();
}
