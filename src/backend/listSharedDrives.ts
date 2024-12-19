import type { ListResponse } from "../interfaces/ListResponse";
import type { NamedRecord } from "../interfaces/NamedRecord";

import { paginationHelper_ } from "./utils/paginationHelper";
import {
  type SafeDriveList,
  SafeDriveService_,
} from "./utils/SafeDriveService";

export function listSharedDrives(): ListResponse {
  try {
    const driveService = new SafeDriveService_();

    const response = paginationHelper_<
      SafeDriveList<{ id: true; name: true }>,
      NamedRecord
    >(
      (pageToken) =>
        driveService.Drives.list(
          { id: true, name: true },
          {
            maxResults: 100,
            orderBy: "name",
            pageToken,
          },
        ),
      (listResponse) =>
        listResponse.drives.map((item) => ({ id: item.id, name: item.name })),
    );
    return {
      response,
      status: "success",
    };
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
}
