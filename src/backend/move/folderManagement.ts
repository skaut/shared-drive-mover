import type { SafeDriveService_ } from "../utils/SafeDriveService";

import { paginationHelper_ } from "../utils/paginationHelper";

function listFolderContents_(
  folderID: string,
  mimeTypeCondition: string,
  driveService: SafeDriveService_,
): Array<GoogleAppsScript.Drive.Schema.File> {
  return paginationHelper_<
    GoogleAppsScript.Drive.Schema.FileList,
    GoogleAppsScript.Drive.Schema.File
  >(
    (pageToken) =>
      driveService.Files.list({
        fields:
          "nextPageToken, items(id, title, capabilities(canMoveItemOutOfDrive))",
        includeItemsFromAllDrives: true,
        maxResults: 1000,
        pageToken,
        q: `"${folderID}" in parents and mimeType ${mimeTypeCondition} and trashed = false`,
        supportsAllDrives: true,
      }),
    (response) => response.items!,
  );
}

export function listFilesInFolder_(
  folderID: string,
  driveService: SafeDriveService_,
): Array<GoogleAppsScript.Drive.Schema.File> {
  return listFolderContents_(
    folderID,
    '!= "application/vnd.google-apps.folder"',
    driveService,
  );
}

export function listFoldersInFolder_(
  folderID: string,
  driveService: SafeDriveService_,
): Array<GoogleAppsScript.Drive.Schema.File> {
  return listFolderContents_(
    folderID,
    '= "application/vnd.google-apps.folder"',
    driveService,
  );
}

export function isFolderEmpty_(
  folderID: string,
  driveService: SafeDriveService_,
): boolean {
  const response = driveService.Files.list({
    fields: "items(id)",
    includeItemsFromAllDrives: true,
    maxResults: 1,
    q: `"${folderID}" in parents and trashed = false`,
    supportsAllDrives: true,
  });
  return response.items!.length === 0;
}

export function deleteFolderIfEmpty_(
  folderID: string,
  driveService: SafeDriveService_,
): void {
  if (!isFolderEmpty_(folderID, driveService)) {
    return;
  }
  const response = driveService.Files.get(folderID, {
    fields: "userPermission(role)",
  });
  if (
    response.userPermission!.role === "owner" ||
    response.userPermission!.role === "organizer"
  ) {
    driveService.Files.remove(folderID);
  }
}
