import type { MoveContext } from "../../interfaces/MoveContext";
import type { MoveState_ } from "../utils/MoveState";
import { listFoldersInFolder_ } from "./folderManagement";

export function resolveDestinationFolder_(
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  state: MoveState_,
  context: MoveContext,
  mergeFolders: boolean,
): GoogleAppsScript.Drive.Schema.File {
  if (mergeFolders) {
    const existingFoldersWithSameName = listFoldersInFolder_(
      context.destinationID,
    ).filter((folder) => folder.title === sourceFolder.title);
    if (existingFoldersWithSameName.length === 1) {
      return existingFoldersWithSameName[0];
    }
    if (existingFoldersWithSameName.length > 1) {
      state.logError(
        context.path.concat([sourceFolder.title!]),
        "Coudn't merge with existing folder as there are multiple existing directories with the same name",
      );
    }
  }
  return Drive.Files!.insert(
    {
      parents: [{ id: context.destinationID }],
      title: sourceFolder.title!,
      mimeType: "application/vnd.google-apps.folder",
    },
    undefined,
    { supportsAllDrives: true, fields: "id" },
  );
}
