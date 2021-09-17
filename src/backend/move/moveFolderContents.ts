function listFilesInFolder(
  folderID: string
): Promise<Array<GoogleAppsScript.Drive.Schema.File>> {
  return paginationHelper<
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
  const errors = (
    await Promise.all(
      files.map((file) =>
        moveFile(file, sourceID, destinationID, path, copyComments)
      )
    )
  ).filter((error): error is MoveError => error !== null);
  return errors;
}

function listFoldersInFolder(
  folderID: string
): Promise<Array<GoogleAppsScript.Drive.Schema.File>> {
  return paginationHelper<
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

async function deleteFolderIfEmpty(folderID: string): Promise<void> {
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
  if (response.items!.length === 0) {
    const response2 = await backoffHelper<GoogleAppsScript.Drive.Schema.File>(
      () =>
        Drive.Files!.get(folderID, {
          fields: "userPermission(role)",
        })
    );
    if (
      response2.userPermission!.role === "owner" ||
      response2.userPermission!.role === "organizer"
    ) {
      await backoffHelper<void>(() => Drive.Files!.remove(folderID));
    }
  }
}

async function getNewFolder(
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  destinationID: string,
  mergeFolders: boolean,
  destinationFolders?: Array<GoogleAppsScript.Drive.Schema.File>
): Promise<GoogleAppsScript.Drive.Schema.File> {
  if (mergeFolders) {
    const destinationFolder = destinationFolders!.find(
      (folder) => folder.title! === sourceFolder.title!
    );
    if (destinationFolder !== undefined) {
      return destinationFolder;
    }
  }
  return backoffHelper<GoogleAppsScript.Drive.Schema.File>(() =>
    Drive.Files!.insert(
      {
        parents: [{ id: destinationID }],
        title: sourceFolder.title!,
        mimeType: "application/vnd.google-apps.folder",
      },
      undefined,
      { supportsAllDrives: true, fields: "id" }
    )
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
    // TODO: Run these in parallel?
    errors = errors.concat(
      await getNewFolder(
        folder,
        destinationID,
        mergeFolders,
        destinationFolders
      )
        .then((destinationFolder) =>
          moveFolderContents(
            folder.id!,
            destinationFolder.id!,
            path.concat([folder.title!]),
            copyComments,
            mergeFolders
          )
        )
        .then(async (newErrors) => {
          await deleteFolderIfEmpty(folder.id!);
          return newErrors;
        })
        .catch((e) => [
          { file: path.concat([folder.title!]), error: e as string },
        ])
    );
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
  return ([] as Array<MoveError>).concat.apply(
    [],
    await Promise.all([
      moveFolderContentsFiles(sourceID, destinationID, path, copyComments),
      moveFolderContentsFolders(
        sourceID,
        destinationID,
        path,
        copyComments,
        mergeFolders
      ),
    ])
  );
}
