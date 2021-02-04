function listFilesInFolder(
  folderID: string
): Array<GoogleAppsScript.Drive.Schema.File> {
  let files: Array<GoogleAppsScript.Drive.Schema.File> = [];
  let pageToken = null;
  do {
    const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
      q:
        '"' +
        folderID +
        '" in parents and mimeType != "application/vnd.google-apps.folder" and trashed = false',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageToken: pageToken,
      maxResults: 1000,
      fields:
        "nextPageToken, items(id, title, capabilities(canMoveItemOutOfDrive))",
    });
    files = files.concat(response.items!);
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  return files;
}

function moveFolderContentsFiles(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): Array<MoveError> {
  const files = listFilesInFolder(sourceID);
  const errors: Array<MoveError> = [];
  for (const file of files) {
    const error = moveFile(file, sourceID, destinationID, path, copyComments);
    if (error !== null) {
      errors.push(error);
    }
  }
  return errors;
}

function listFoldersInFolder(
  folderID: string
): Array<GoogleAppsScript.Drive.Schema.File> {
  let folders: Array<GoogleAppsScript.Drive.Schema.File> = [];
  let pageToken = null;
  do {
    const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
      q:
        '"' +
        folderID +
        '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageToken: pageToken,
      maxResults: 1000,
      fields: "nextPageToken, items(id, title)",
    });
    folders = folders.concat(response.items!);
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  return folders;
}

function deleteFolderIfEmpty(folderID: string): void {
  const response = Drive.Files!.list({
    q: '"' + folderID + '" in parents and trashed = false',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    maxResults: 1,
    fields: "items(id)",
  });
  if (response.items!.length === 0) {
    const response2 = Drive.Files!.get(folderID, {
      fields: "userPermission(role)",
    });
    if (
      response2.userPermission!.role === "owner" ||
      response2.userPermission!.role === "organizer"
    ) {
      Drive.Files!.remove(folderID);
    }
  }
}

function getNewFolder(
  oldFolder: GoogleAppsScript.Drive.Schema.File,
  destinationID: string,
  mergeFolders: boolean,
  newFolders?: Array<GoogleAppsScript.Drive.Schema.File>
): GoogleAppsScript.Drive.Schema.File {
  if (mergeFolders) {
    const matchingNewFolders = newFolders!.filter(
      (folder) => folder.title! === oldFolder.title!
    );
    if (matchingNewFolders.length === 1) {
      return matchingNewFolders[0];
    }
  }
  return Drive.Files!.insert(
    {
      parents: [{ id: destinationID }],
      title: oldFolder.title!,
      mimeType: "application/vnd.google-apps.folder",
    },
    undefined,
    { supportsAllDrives: true, fields: "id" }
  );
}

function moveFolderContentsFolders(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Array<MoveError> {
  const oldFolders = listFoldersInFolder(sourceID);
  let newFolders = undefined;
  if (mergeFolders) {
    newFolders = listFoldersInFolder(destinationID);
  }
  let errors: Array<MoveError> = [];
  for (const folder of oldFolders) {
    try {
      const newFolder = getNewFolder(
        folder,
        destinationID,
        mergeFolders,
        newFolders
      );
      errors = errors.concat(
        moveFolderContents(
          folder.id!,
          newFolder.id!,
          path.concat([folder.title!]),
          copyComments,
          mergeFolders
        )
      );
      deleteFolderIfEmpty(folder.id!);
    } catch (e) {
      errors.push({ file: path.concat([folder.title!]), error: e as string });
    }
  }
  return errors;
}

function moveFolderContents(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Array<MoveError> {
  return moveFolderContentsFiles(
    sourceID,
    destinationID,
    path,
    copyComments
  ).concat(
    moveFolderContentsFolders(
      sourceID,
      destinationID,
      path,
      copyComments,
      mergeFolders
    )
  );
}
