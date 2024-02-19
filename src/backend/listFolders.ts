import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";
import { paginationHelper_ } from "./utils/paginationHelper";

export function listFolders(parentID: google.script.Parameter): ListResponse {
  if (typeof parentID !== "string") {
    return { status: "error", type: "invalidParameter" };
  }
  try {
    const response = paginationHelper_<
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
      status: "success",
      response,
    };
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
}
