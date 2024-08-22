import { paginationHelper_ } from "../utils/paginationHelper";

function listFolderContents_(
  folderID: string,
  mimeTypeCondition: string,
): Array<GoogleAppsScript.Drive.Schema.File> {
  return paginationHelper_<
    GoogleAppsScript.Drive.Schema.FileList,
    GoogleAppsScript.Drive.Schema.File
  >(
    (pageToken) =>
      Drive.Files!.list({
        fields:
          "nextPageToken, items(id, title, capabilities(canMoveItemOutOfDrive))",
        includeItemsFromAllDrives: true,
        maxResults: 1000,
        pageToken: pageToken,
        q:
          '"' +
          folderID +
          '" in parents and mimeType ' +
          mimeTypeCondition +
          " and trashed = false",
        supportsAllDrives: true,
      }),
    (response) => response.items!,
  );
}

export function listFilesInFolder_(
  folderID: string,
): Array<GoogleAppsScript.Drive.Schema.File> {
  return listFolderContents_(
    folderID,
    '!= "application/vnd.google-apps.folder"',
  );
}

export function listFoldersInFolder_(
  folderID: string,
): Array<GoogleAppsScript.Drive.Schema.File> {
  return listFolderContents_(
    folderID,
    '= "application/vnd.google-apps.folder"',
  );
}

export function isFolderEmpty_(folderID: string): boolean {
  const response = Drive.Files!.list({
    fields: "items(id)",
    includeItemsFromAllDrives: true,
    maxResults: 1,
    q: '"' + folderID + '" in parents and trashed = false',
    supportsAllDrives: true,
  });
  return response.items!.length === 0;
}

export function deleteFolderIfEmpty_(folderID: string): void {
  if (!isFolderEmpty_(folderID)) {
    return;
  }
  const response = Drive.Files!.get(folderID, {
    fields: "userPermission(role)",
  });
  if (
    response.userPermission!.role === "owner" ||
    response.userPermission!.role === "organizer"
  ) {
    Drive.Files!.remove(folderID);
  }
}
