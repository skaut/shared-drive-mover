import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";

import { paginationHelper_ } from "./utils/paginationHelper";
import { SafeDriveService_ } from "./utils/SafeDriveService";

export function listFolders(parentID: google.script.Parameter): ListResponse {
  if (typeof parentID !== "string") {
    return { status: "error", type: "invalidParameter" };
  }
  try {
    const driveService = new SafeDriveService_();

    const response = paginationHelper_<
      GoogleAppsScript.Drive.Schema.FileList,
      NamedRecord
    >(
      (pageToken) =>
        driveService.Files.list({
          fields:
            "nextPageToken, items(id, title, mimeType, shortcutDetails(targetId))",
          includeItemsFromAllDrives: true,
          maxResults: 1000,
          pageToken,
          q: `"${parentID}" in parents and (mimeType = "application/vnd.google-apps.folder" or (mimeType = "application/vnd.google-apps.shortcut" and shortcutDetails.targetMimeType = "application/vnd.google-apps.folder")) and trashed = false`,
          supportsAllDrives: true,
        }),
      (listResponse) =>
        listResponse
          .items!.sort((first, second) =>
            first.title!.localeCompare(
              second.title!,
              Session.getActiveUserLocale(),
            ),
          )
          .map((item) => {
            const id =
              item.mimeType === "application/vnd.google-apps.shortcut"
                ? item.shortcutDetails!.targetId!
                : item.id!;
            return { id, name: item.title! };
          }),
    );
    return {
      response,
      status: "success",
    };
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
}
