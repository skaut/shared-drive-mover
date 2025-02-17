import type { DeepPick } from "../utils/DeepPick";
import type {
  SafeDriveService_,
  SafeFile,
  SafeFileList,
} from "../utils/SafeDriveService";

import { paginationHelper_ } from "../utils/paginationHelper";

export interface ListFolderContentsFields {
  capabilities: { canMoveItemOutOfDrive: true };
  id: true;
  name: true;
}

export function deleteFolderIfEmpty_(
  folderID: string,
  driveService: SafeDriveService_,
): void {
  if (!isFolderEmpty_(folderID, driveService)) {
    return;
  }
  const response = driveService.Files.get(folderID, {
    capabilities: { canDelete: true },
  });
  if (response.capabilities.canDelete) {
    driveService.Files.remove(folderID);
  }
}

export function isFolderEmpty_(
  folderID: string,
  driveService: SafeDriveService_,
): boolean {
  const response = driveService.Files.list(
    { id: true },
    {
      includeItemsFromAllDrives: true,
      maxResults: 1,
      q: `"${folderID}" in parents and trashed = false`,
      supportsAllDrives: true,
    },
  );
  return response.files.length === 0;
}

export function listFilesInFolder_(
  folderID: string,
  driveService: SafeDriveService_,
): Array<DeepPick<SafeFile, ListFolderContentsFields>> {
  return listFolderContents_(
    folderID,
    '!= "application/vnd.google-apps.folder"',
    driveService,
  );
}

export function listFoldersInFolder_(
  folderID: string,
  driveService: SafeDriveService_,
): Array<DeepPick<SafeFile, ListFolderContentsFields>> {
  return listFolderContents_(
    folderID,
    '= "application/vnd.google-apps.folder"',
    driveService,
  );
}

function listFolderContents_(
  folderID: string,
  mimeTypeCondition: string,
  driveService: SafeDriveService_,
): Array<DeepPick<SafeFile, ListFolderContentsFields>> {
  return paginationHelper_<
    SafeFileList<ListFolderContentsFields>,
    DeepPick<SafeFile, ListFolderContentsFields>
  >(
    (pageToken) =>
      driveService.Files.list(
        {
          capabilities: { canMoveItemOutOfDrive: true },
          id: true,
          name: true,
        },
        {
          includeItemsFromAllDrives: true,
          maxResults: 1000,
          pageToken,
          q: `"${folderID}" in parents and mimeType ${mimeTypeCondition} and trashed = false`,
          supportsAllDrives: true,
        },
      ),
    (response) => response.files,
  );
}
