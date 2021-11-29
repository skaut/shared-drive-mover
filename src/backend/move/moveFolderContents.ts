import { backoffHelper } from "../backoffHelper";
import { moveFile } from "./moveFile";
import { paginationHelper } from "../paginationHelper";

import type { MoveError } from "../../interfaces/MoveError";

async function listFilesInFolder(
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
      files.map(async (file) =>
        moveFile(file, sourceID, destinationID, path, copyComments)
      )
    )
  ).filter((error): error is MoveError => error !== null);
  return errors;
}

async function listFoldersInFolder(
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
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      await backoffHelper<void>(() => {
        Drive.Files!.remove(folderID);
      });
    }
  }
}

async function getNewFolder(
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  destinationID: string,
  path: Array<string>,
  mergeFolders: boolean,
  destinationFolders?: Array<GoogleAppsScript.Drive.Schema.File>
): Promise<[GoogleAppsScript.Drive.Schema.File, MoveError | undefined]> {
  let error = undefined;
  if (mergeFolders) {
    const existingFoldersWithSameName = destinationFolders!.filter(
      (folder) => folder.title === sourceFolder.title
    );
    if (existingFoldersWithSameName.length === 1) {
      return [existingFoldersWithSameName[0], undefined];
    }
    if (existingFoldersWithSameName.length > 1) {
      error = {
        file: path.concat([sourceFolder.title!]),
        error:
          "Coudn't merge with existing folder as there are multiple existing directories with the same name",
      };
    }
  }
  return [
    await backoffHelper<GoogleAppsScript.Drive.Schema.File>(() =>
      Drive.Files!.insert(
        {
          parents: [{ id: destinationID }],
          title: sourceFolder.title!,
          mimeType: "application/vnd.google-apps.folder",
        },
        undefined,
        { supportsAllDrives: true, fields: "id" }
      )
    ),
    error,
  ];
}

async function moveFolderContentsFolders(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Promise<Array<MoveError>> {
  const sourceFolders = await listFoldersInFolder(sourceID);
  let destinationFolders:
    | Array<GoogleAppsScript.Drive.Schema.File>
    | undefined = undefined;
  if (mergeFolders) {
    destinationFolders = await listFoldersInFolder(destinationID);
  }
  return ([] as Array<MoveError>).concat.apply(
    [],
    await Promise.all(
      sourceFolders.map(async (folder): Promise<Array<MoveError>> => {
        try {
          const [destinationFolder, folderMergeError] = await getNewFolder(
            folder,
            destinationID,
            path,
            mergeFolders,
            destinationFolders
          );
          const errors: Array<MoveError> =
            folderMergeError !== undefined ? [folderMergeError] : [];
          errors.concat(
            await moveFolderContents(
              folder.id!,
              destinationFolder.id!,
              path.concat([folder.title!]),
              copyComments,
              mergeFolders
            )
          );
          await deleteFolderIfEmpty(folder.id!);
          return errors;
        } catch (e) {
          return [{ file: path.concat([folder.title!]), error: e as string }];
        }
      })
    )
  );
}

export async function moveFolderContents(
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
