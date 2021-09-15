/* exported move */

async function isDirectoryEmpty(directoryID: string): Promise<boolean> {
  const response = await backoffHelper(() =>
    Drive.Files!.list({
      q: '"' + directoryID + '" in parents and trashed = false',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      maxResults: 1,
      fields: "items(id)",
    })
  );
  return response.items!.length === 0;
}

async function move(
  sourceID: string,
  destinationID: string,
  copyComments: boolean,
  mergeFolders: boolean,
  notEmptyOverride: boolean
): Promise<MoveResponse> {
  const isEmpty = await isDirectoryEmpty(destinationID);
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
