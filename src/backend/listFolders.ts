import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";

import { paginationHelper_ } from "./utils/paginationHelper";
import { SafeDriveService_, type SafeFileList } from "./utils/SafeDriveService";

export function listFolders(parentID: google.script.Parameter): ListResponse {
  if (typeof parentID !== "string") {
    return { status: "error", type: "invalidParameter" };
  }
  try {
    const driveService = new SafeDriveService_();

    const response = paginationHelper_<
      SafeFileList<{
        id: true;
        mimeType: true;
        shortcutDetails: { targetId: true };
        title: true;
      }>,
      NamedRecord
    >(
      (pageToken) =>
        driveService.Files.list(
          {
            id: true,
            mimeType: true,
            shortcutDetails: { targetId: true },
            title: true,
          },
          {
            includeItemsFromAllDrives: true,
            maxResults: 1000,
            pageToken,
            q: `"${parentID}" in parents and (mimeType = "application/vnd.google-apps.folder" or (mimeType = "application/vnd.google-apps.shortcut" and shortcutDetails.targetMimeType = "application/vnd.google-apps.folder")) and trashed = false`,
            supportsAllDrives: true,
          },
        ),
      (listResponse) =>
        listResponse.items
          .sort((first, second) =>
            first.title.localeCompare(
              second.title,
              Session.getActiveUserLocale(),
            ),
          )
          .map((item) => {
            const id =
              item.mimeType === "application/vnd.google-apps.shortcut"
                ? (item.shortcutDetails?.targetId ?? item.id)
                : item.id;
            return { id, name: item.title };
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
