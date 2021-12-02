import {
  deleteFolderIfEmpty,
  listFilesInFolder,
  listFoldersInFolder,
} from "./folderManagement";
import { moveFile } from "./moveFile";
import { resolveDestinationFolder } from "./resolveDestinationFolder";

import type { MoveError } from "../../interfaces/MoveError";

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

function moveFolderContentsFolders(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Array<MoveError> {
  const sourceFolders = listFoldersInFolder(sourceID);
  return ([] as Array<MoveError>).concat.apply(
    [],
    sourceFolders.map((folder) => {
      try {
        const [destinationFolder, folderMergeError] = resolveDestinationFolder(
          folder,
          destinationID,
          path,
          mergeFolders
        );
        const errors: Array<MoveError> =
          folderMergeError !== undefined ? [folderMergeError] : [];
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
        return [
          { file: path.concat([folder.title!]), error: (e as Error).message },
        ];
      }
    })
  );
}

export function moveFolderContents(
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
