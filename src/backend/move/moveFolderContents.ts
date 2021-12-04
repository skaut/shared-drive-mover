import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { MoveError } from "../../interfaces/MoveError";

function moveFolderContentsFiles_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): Array<MoveError> {
  return listFilesInFolder_(sourceID)
    .map((file) => moveFile_(file, sourceID, destinationID, path, copyComments))
    .filter((error): error is MoveError => error !== null);
}

function moveFolderContentsFolders_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Array<MoveError> {
  const sourceFolders = listFoldersInFolder_(sourceID);
  return ([] as Array<MoveError>).concat.apply(
    [],
    sourceFolders.map((folder) => {
      try {
        const [destinationFolder, folderMergeError] = resolveDestinationFolder_(
          folder,
          destinationID,
          path,
          mergeFolders
        );
        const errors: Array<MoveError> =
          folderMergeError !== undefined ? [folderMergeError] : [];
        errors.concat(
          moveFolderContents_(
            folder.id!,
            destinationFolder.id!,
            path.concat([folder.title!]),
            copyComments,
            mergeFolders
          )
        );
        deleteFolderIfEmpty_(folder.id!);
        return errors;
      } catch (e) {
        return [
          { file: path.concat([folder.title!]), error: (e as Error).message },
        ];
      }
    })
  );
}

export function moveFolderContents_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean
): Array<MoveError> {
  return moveFolderContentsFiles_(
    sourceID,
    destinationID,
    path,
    copyComments
  ).concat(
    moveFolderContentsFolders_(
      sourceID,
      destinationID,
      path,
      copyComments,
      mergeFolders
    )
  );
}
