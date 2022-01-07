import { backoffHelper_ } from "../utils/backoffHelper";
import { listFoldersInFolder_ } from "./folderManagement";

import type { MoveContext_ } from "../utils/MoveContext";

export async function resolveDestinationFolder_(
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  context: MoveContext_,
  mergeFolders: boolean
): Promise<GoogleAppsScript.Drive.Schema.File> {
  if (mergeFolders) {
    const existingFoldersWithSameName = await listFoldersInFolder_(
      context.destinationID
    ).then((folders) =>
      folders.filter((folder) => folder.title === sourceFolder.title)
    );
    if (existingFoldersWithSameName.length === 1) {
      return existingFoldersWithSameName[0];
    }
    if (existingFoldersWithSameName.length > 1) {
      context.logger.log(
        context.path.concat([sourceFolder.title!]),
        "Coudn't merge with existing folder as there are multiple existing directories with the same name"
      );
    }
  }
  return await backoffHelper_(() =>
    Drive.Files!.insert(
      {
        parents: [{ id: context.destinationID }],
        title: sourceFolder.title!,
        mimeType: "application/vnd.google-apps.folder",
      },
      undefined,
      { supportsAllDrives: true, fields: "id" }
    )
  );
}
