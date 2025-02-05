import type { DeepKeyof } from "../DeepKeyof";
import type { DeepPick } from "../DeepPick";

import { stringifyFields_ } from "./stringifyFields";

export interface SafeDrive {
  id: string;
  name: string;
}

export interface SafeDriveList<F extends DeepKeyof<SafeDrive>> {
  drives: Array<DeepPick<SafeDrive, F>>;
  nextPageToken?: string;
}

const safeDriveKeys: DeepKeyof<SafeDrive> = {
  id: true,
  name: true,
};

function driveIsSafe_<F extends DeepKeyof<SafeDrive>>(
  drive: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
  keys: F | null,
): drive is typeof keys extends null ? SafeDrive : DeepPick<SafeDrive, F> {
  if (keys === null) {
    return driveIsSafe_(drive, safeDriveKeys);
  }
  for (const key in keys) {
    if (!Object.prototype.hasOwnProperty.call(keys, key)) {
      continue;
    }
    if (drive[key as keyof DeepKeyof<SafeDrive>] === undefined) {
      return false;
    }
  }
  return true;
}

function driveListIsSafe_<F extends DeepKeyof<SafeDrive>>(
  driveList: GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveList,
  keys: F | null,
): driveList is SafeDriveList<F> {
  return driveList.drives?.every((file) => driveIsSafe_(file, keys)) === true;
}

export const SafeDrivesCollection_ = {
  list: <F extends DeepKeyof<SafeDrive>>(
    fields: F | null,
    optionalArgs: {
      maxResults?: number;
      orderBy?: string;
      pageToken?: string | undefined;
    } = {},
  ): SafeDriveList<F> => {
    const ret = Drive.Drives.list({
      ...optionalArgs,
      ...(fields !== null && {
        fields: `nextPageToken, drives(${stringifyFields_(fields)})`,
      }),
    });
    if (!driveListIsSafe_(ret, fields)) {
      throw new Error("Drives.list: Drive list is not safe.");
    }
    return ret;
  },
};
