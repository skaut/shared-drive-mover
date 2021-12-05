import { listFoldersInFolder_ } from "./folderManagement";

import type { ErrorLogger_ } from "../utils/ErrorLogger";

export function resolveDestinationFolder_(
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  destinationParentID: string,
  path: Array<string>,
  mergeFolders: boolean,
  logger: ErrorLogger_
): GoogleAppsScript.Drive.Schema.File {
  if (mergeFolders) {
    const existingFoldersWithSameName = listFoldersInFolder_(
      destinationParentID
    ).filter((folder) => folder.title === sourceFolder.title);
    if (existingFoldersWithSameName.length === 1) {
      return existingFoldersWithSameName[0];
    }
    if (existingFoldersWithSameName.length > 1) {
      logger.log(
        path.concat([sourceFolder.title!]),
        "Coudn't merge with existing folder as there are multiple existing directories with the same name"
      );
    }
  }
  return Drive.Files!.insert(
    {
      parents: [{ id: destinationParentID }],
      title: sourceFolder.title!,
      mimeType: "application/vnd.google-apps.folder",
    },
    undefined,
    { supportsAllDrives: true, fields: "id" }
  );
}
