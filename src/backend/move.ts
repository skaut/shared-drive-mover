import { backoffHelper } from "./backoffHelper";
import { moveFolderContents } from "./move/moveFolderContents";

import type { MoveResponse } from "../interfaces/MoveResponse";

async function isFolderEmpty(folderID: string): Promise<boolean> {
  const response = await backoffHelper<GoogleAppsScript.Drive.Schema.FileList>(
    () =>
      Drive.Files!.list({
        q: '"' + folderID + '" in parents and trashed = false',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        maxResults: 1,
        fields: "items(id)",
      })
  );
  return response.items!.length === 0;
}

export async function move(
  sourceID: string,
  destinationID: string,
  copyComments: boolean,
  mergeFolders: boolean,
  notEmptyOverride: boolean
): Promise<MoveResponse> {
  const isEmpty = await isFolderEmpty(destinationID);
  if (!notEmptyOverride && !isEmpty) {
    return { status: "error", reason: "notEmpty" };
  }
  const errors = await moveFolderContents(
    sourceID,
    destinationID,
    [],
    copyComments,
    mergeFolders
  );
  if (errors.length > 0) {
    console.error(errors);
  }
  return { status: "success", errors };
}
