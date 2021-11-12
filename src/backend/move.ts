/* exported move */

function isDirectoryEmpty(directoryID: string): boolean {
  const response = Drive.Files!.list({
    q: '"' + directoryID + '" in parents and trashed = false',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    maxResults: 1,
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
  const isEmpty = isDirectoryEmpty(destinationID);
  if (!notEmptyOverride && !isEmpty) {
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
