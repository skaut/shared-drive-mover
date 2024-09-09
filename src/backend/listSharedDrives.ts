import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";

import { paginationHelper_ } from "./utils/paginationHelper";
import { SafeDriveService_ } from "./utils/SafeDriveService";

export function listSharedDrives(): ListResponse {
  try {
    const driveService = new SafeDriveService_();

    const response = paginationHelper_<
      GoogleAppsScript.Drive.Schema.DriveList,
      NamedRecord
    >(
      (pageToken) =>
        driveService.Drives.list({
          fields: "nextPageToken, items(id, name)",
          maxResults: 100,
          orderBy: "name",
          pageToken,
        }),
      (listResponse) =>
        listResponse.items!.map((item) => ({ id: item.id!, name: item.name! })),
    );
    return {
      response,
      status: "success",
    };
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
}
