import { paginationHelper_ } from "./utils/paginationHelper";

import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";

export function listSharedDrives(): ListResponse {
  const response = paginationHelper_<
    GoogleAppsScript.Drive.Schema.DriveList,
    NamedRecord
  >(
    (pageToken) =>
      Drive.Drives!.list({
        pageToken: pageToken,
        maxResults: 100,
        orderBy: "name",
        fields: "nextPageToken, items(id, name)",
      }),
    (response) =>
      response.items!.map((item) => ({ id: item.id!, name: item.name! }))
  );
  return {
    status: "success",
    response,
  };
}
