/* exported move */

function isDirectoryEmpty(directoryID: string): boolean {
  const response = Drive.Files!.list({
    includeItemsFromAllDrives: true,
    maxResults: 1,
    q: '"' + directoryID + '" in parents and trashed = false',
    supportsAllDrives: true,
    fields: "items(id)",
  });
  return response.items!.length === 0;
}

function move(
  sourceID: string,
  destinationID: string,
  copyComments: boolean,
  mergeFolders: boolean,
  notEmptyOverride: boolean
): MoveResponse {
  if (!notEmptyOverride && !isDirectoryEmpty(destinationID)) {
    return { status: "error", reason: "notEmpty" };
  }
  const errors = moveFolderContents(
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
