function listFilesInFolder(
  folderID: string
): Array<GoogleAppsScript.Drive.Schema.File> {
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

function moveFolderContentsFiles(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): Array<MoveError> {
  return listFilesInFolder(sourceID)
    .map((file) => moveFile(file, sourceID, destinationID, path, copyComments))
    .filter((error): error is MoveError => error !== null);
}

function listFoldersInFolder(
  folderID: string
): Array<GoogleAppsScript.Drive.Schema.File> {
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
): {
  folder: GoogleAppsScript.Drive.Schema.File;
  error?: MoveError;
} {
  let error = undefined;
  if (mergeFolders) {
    const existingFoldersWithSameName = destinationFolders!.filter(
      (folder) => folder.title === sourceFolder.title
    );
    if (existingFoldersWithSameName.length === 1) {
      return { folder: existingFoldersWithSameName[0] };
    }
    if (existingFoldersWithSameName.length > 1) {
      error = {
        file: [],
        error:
          "Coudn't merge with existing folder as there are multiple existing directories with the same name",
      };
    }
  }
  return {
    folder: Drive.Files!.insert(
      {
        parents: [{ id: destinationID }],
        title: sourceFolder.title!,
        mimeType: "application/vnd.google-apps.folder",
      },
      undefined,
      { supportsAllDrives: true, fields: "id" }
    ),
    error,
  };
}

function moveFolderContentsFolders(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Array<MoveError> {
  const sourceFolders = listFoldersInFolder(sourceID);
  let destinationFolders:
    | Array<GoogleAppsScript.Drive.Schema.File>
    | undefined = undefined;
  if (mergeFolders) {
    destinationFolders = listFoldersInFolder(destinationID);
  }
  return ([] as Array<MoveError>).concat.apply(
    [],
    sourceFolders.map((folder) => {
      try {
        const errors: Array<MoveError> = [];
        const { folder: destinationFolder, error: folderMergeError } =
          getNewFolder(folder, destinationID, mergeFolders, destinationFolders);
        if (folderMergeError !== undefined) {
          errors.concat([folderMergeError]);
        }
        errors.concat(
          moveFolderContents(
            folder.id!,
            destinationFolder.id!,
            path.concat([folder.title!]),
            copyComments,
            mergeFolders
          )
        );
        deleteFolderIfEmpty(folder.id!);
        return errors;
      } catch (e) {
        return [{ file: path.concat([folder.title!]), error: e as string }];
      }
    })
  );
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
