import { paginationHelper } from "./paginationHelper";

import type { NamedRecord } from "../interfaces/NamedRecord";

export async function listFolders(
  parentID: string
): Promise<Array<NamedRecord>> {
  return paginationHelper<GoogleAppsScript.Drive.Schema.FileList, NamedRecord>(
    (pageToken) =>
      Drive.Files!.list({
        q:
          '"' +
          parentID +
          '" in parents and (mimeType = "application/vnd.google-apps.folder" or (mimeType = "application/vnd.google-apps.shortcut" and shortcutDetails.targetMimeType = "application/vnd.google-apps.folder")) and trashed = false',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageToken: pageToken,
        maxResults: 1000,
        fields:
          "nextPageToken, items(id, title, mimeType, shortcutDetails(targetId))",
      }),
    (response) =>
      response
        .items!.sort((first, second) =>
          first.title!.localeCompare(
            second.title!,
            Session.getActiveUserLocale()
          )
        )
        .map((item) => {
          const id =
            item.mimeType === "application/vnd.google-apps.shortcut"
              ? item.shortcutDetails!.targetId!
              : item.id!;
          return { id, name: item.title! };
        })
  );
}
