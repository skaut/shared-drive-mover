import { paginationHelper_ } from "./utils/paginationHelper";

import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";

export async function listFolders(parentID: string): Promise<ListResponse> {
  try {
    const response = await paginationHelper_<
      GoogleAppsScript.Drive.Schema.FileList,
      NamedRecord
    >(
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
    return {
      status: "success",
      response,
    };
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
}
