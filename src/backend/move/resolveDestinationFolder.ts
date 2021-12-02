import { listFoldersInFolder } from "./folderManagement";

import type { MoveError } from "../../interfaces/MoveError";

export function resolveDestinationFolder(
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  destinationParentID: string,
  path: Array<string>,
  mergeFolders: boolean
): [GoogleAppsScript.Drive.Schema.File, MoveError | undefined] {
  let error = undefined;
  if (mergeFolders) {
    const existingFoldersWithSameName = listFoldersInFolder(
      destinationParentID
    ).filter((folder) => folder.title === sourceFolder.title);
    if (existingFoldersWithSameName.length === 1) {
      return [existingFoldersWithSameName[0], undefined];
    }
    if (existingFoldersWithSameName.length > 1) {
      error = {
        file: path.concat([sourceFolder.title!]),
        error:
          "Coudn't merge with existing folder as there are multiple existing directories with the same name",
      };
    }
  }
  return [
    Drive.Files!.insert(
      {
        parents: [{ id: destinationParentID }],
        title: sourceFolder.title!,
        mimeType: "application/vnd.google-apps.folder",
      },
      undefined,
      { supportsAllDrives: true, fields: "id" }
    ),
    error,
  ];
}
