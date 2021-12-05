import { backoffHelper_ } from "../utils/backoffHelper";
import { paginationHelper_ } from "../utils/paginationHelper";

async function listFolderContents_(
  folderID: string,
  mimeTypeCondition: string
): Promise<Array<GoogleAppsScript.Drive.Schema.File>> {
  return await paginationHelper_<
    GoogleAppsScript.Drive.Schema.FileList,
    GoogleAppsScript.Drive.Schema.File
  >(
    (pageToken) =>
      Drive.Files!.list({
        q:
          '"' +
          folderID +
          '" in parents and mimeType ' +
          mimeTypeCondition +
          " and trashed = false",
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

export async function listFilesInFolder_(
  folderID: string
): Promise<Array<GoogleAppsScript.Drive.Schema.File>> {
  return await listFolderContents_(
    folderID,
    '!= "application/vnd.google-apps.folder"'
  );
}

export async function listFoldersInFolder_(
  folderID: string
): Promise<Array<GoogleAppsScript.Drive.Schema.File>> {
  return await listFolderContents_(
    folderID,
    '= "application/vnd.google-apps.folder"'
  );
}

export async function isFolderEmpty_(folderID: string): Promise<boolean> {
  const response = await backoffHelper_(() =>
    Drive.Files!.list({
      q: '"' + folderID + '" in parents and trashed = false',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      maxResults: 1,
      fields: "items(id)",
    })
  );
  return response.items!.length === 0;
}

export async function deleteFolderIfEmpty_(folderID: string): Promise<void> {
  if (!(await isFolderEmpty_(folderID))) {
    return;
  }
  const response = await backoffHelper_(() =>
    Drive.Files!.get(folderID, {
      fields: "userPermission(role)",
    })
  );
  if (
    response.userPermission!.role === "owner" ||
    response.userPermission!.role === "organizer"
  ) {
    await backoffHelper_(() => {
      Drive.Files!.remove(folderID);
    });
  }
}
