import type { MoveError } from "../../interfaces/MoveError";

export function resolveDestinationFolder(
  sourceFolder: GoogleAppsScript.Drive.Schema.File,
  destinationID: string,
  path: Array<string>,
  mergeFolders: boolean,
  destinationFolders?: Array<GoogleAppsScript.Drive.Schema.File>
): [GoogleAppsScript.Drive.Schema.File, MoveError | undefined] {
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
    Drive.Files!.insert(
      {
        parents: [{ id: destinationID }],
        title: sourceFolder.title!,
        mimeType: "application/vnd.google-apps.folder",
      },
      undefined,
      { supportsAllDrives: true, fields: "id" }
    ),
    error,
  ];
}
