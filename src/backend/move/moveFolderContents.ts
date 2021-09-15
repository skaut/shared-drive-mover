async function listFilesInFolder(
  folderID: string
): Promise<Array<GoogleAppsScript.Drive.Schema.File>> {
  return await paginationHelper<
    GoogleAppsScript.Drive.Schema.FileList,
    GoogleAppsScript.Drive.Schema.File
  >(
    (pageToken) =>
      Drive.Files!.list({
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
      }),
    (response) => response.items!
  );
}

async function moveFolderContentsFiles(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): Promise<Array<MoveError>> {
  const files = await listFilesInFolder(sourceID);
  const errors: Array<MoveError> = [];
  for (const file of files) {
    const error = moveFile(file, sourceID, destinationID, path, copyComments);
    if (error !== null) {
      errors.push(error);
    }
  }
  return errors;
}

async function listFoldersInFolder(
  folderID: string
): Promise<Array<GoogleAppsScript.Drive.Schema.File>> {
  return await paginationHelper<
    GoogleAppsScript.Drive.Schema.FileList,
    GoogleAppsScript.Drive.Schema.File
  >(
    (pageToken) =>
      Drive.Files!.list({
        q:
          '"' +
          folderID +
          '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageToken: pageToken,
        maxResults: 1000,
        fields: "nextPageToken, items(id, title)",
      }),
    (response) => response.items!
  );
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
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  destinationID: string,
  mergeFolders: boolean,
  destinationFolders?: Array<GoogleAppsScript.Drive.Schema.File>
): GoogleAppsScript.Drive.Schema.File {
  if (mergeFolders) {
    const destinationFolder = destinationFolders!.find(
      (folder) => folder.title! === sourceFolder.title!
    );
    if (destinationFolder !== undefined) {
      return destinationFolder;
    }
  }
  return Drive.Files!.insert(
    {
      parents: [{ id: destinationID }],
      title: sourceFolder.title!,
      mimeType: "application/vnd.google-apps.folder",
    },
    undefined,
    { supportsAllDrives: true, fields: "id" }
  );
}

async function moveFolderContentsFolders(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Promise<Array<MoveError>> {
  const sourceFolders = await listFoldersInFolder(sourceID);
  let destinationFolders = undefined;
  if (mergeFolders) {
    destinationFolders = await listFoldersInFolder(destinationID);
  }
  let errors: Array<MoveError> = [];
  for (const folder of sourceFolders) {
    try {
      const destinationFolder = getNewFolder(
        folder,
        destinationID,
        mergeFolders,
        destinationFolders
      );
      errors = errors.concat(
        await moveFolderContents(
          folder.id!,
          destinationFolder.id!,
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

async function moveFolderContents(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Promise<Array<MoveError>> {
  return (
    await moveFolderContentsFiles(sourceID, destinationID, path, copyComments)
  ).concat(
    await moveFolderContentsFolders(
      sourceID,
      destinationID,
      path,
      copyComments,
      mergeFolders
    )
  );
}
