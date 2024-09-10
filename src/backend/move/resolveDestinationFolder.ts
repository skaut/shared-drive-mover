import type { MoveContext } from "../../interfaces/MoveContext";
import type { DeepPick } from "../utils/DeepPick";
import type { MoveState_ } from "../utils/MoveState";
import type { SafeDriveService_, SafeFile } from "../utils/SafeDriveService";

import {
  type ListFolderContentsFields,
  listFoldersInFolder_,
} from "./folderManagement";

export function resolveDestinationFolder_(
  sourceFolder: DeepPick<SafeFile, ListFolderContentsFields>,
  state: MoveState_,
  context: MoveContext,
  mergeFolders: boolean,
  driveService: SafeDriveService_,
): DeepPick<SafeFile, { id: true }> {
  if (mergeFolders) {
    const existingFoldersWithSameName = listFoldersInFolder_(
      context.destinationID,
      driveService,
    ).filter((folder) => folder.title === sourceFolder.title);
    if (existingFoldersWithSameName.length === 1) {
      return existingFoldersWithSameName[0];
    }
    if (existingFoldersWithSameName.length > 1) {
      state.logError(
        context.path.concat([sourceFolder.title]),
        "Coudn't merge with existing folder as there are multiple existing directories with the same name",
      );
    }
  }
  return driveService.Files.insert(
    {
      mimeType: "application/vnd.google-apps.folder",
      parents: [{ id: context.destinationID }],
      title: sourceFolder.title,
    },
    { id: true },
    undefined,
    { supportsAllDrives: true },
  );
}
