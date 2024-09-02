import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";

import { paginationHelper_ } from "./utils/paginationHelper";

export function listSharedDrives(): ListResponse {
  try {
    const response = paginationHelper_<
      GoogleAppsScript.Drive.Schema.DriveList,
      NamedRecord
    >(
      (pageToken) =>
        Drive.Drives!.list({
          fields: "nextPageToken, items(id, name)",
          maxResults: 100,
          orderBy: "name",
          pageToken,
        }),
      (listRepsonse) =>
        listRepsonse.items!.map((item) => ({ id: item.id!, name: item.name! })),
    );
    return {
      response,
      status: "success",
    };
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
}
