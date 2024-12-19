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

export class SafeDrivesCollection_ {
  private readonly unsafeDrives: GoogleAppsScript.Drive_v3.Drive.V3.Collection.DrivesCollection;

  public constructor() {
    // TODO: Remove and access directly
    this.unsafeDrives = Drive.Drives;
  }

  private static driveIsSafe<F extends DeepKeyof<SafeDrive>>(
    drive: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
    keys: F | null,
  ): drive is typeof keys extends null ? SafeDrive : DeepPick<SafeDrive, F> {
    if (keys === null) {
      return SafeDrivesCollection_.driveIsSafe(drive, safeDriveKeys);
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

  private static driveListIsSafe<F extends DeepKeyof<SafeDrive>>(
    driveList: GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveList,
    keys: F | null,
  ): driveList is SafeDriveList<F> {
    return (
      driveList.drives?.every((file) =>
        SafeDrivesCollection_.driveIsSafe(file, keys),
      ) === true
    );
  }

  public list<F extends DeepKeyof<SafeDrive>>(
    fields: F | null,
    optionalArgs: {
      maxResults?: number;
      orderBy?: string;
      pageToken?: string | undefined;
    } = {},
  ): SafeDriveList<F> {
    const ret = this.unsafeDrives.list({
      ...optionalArgs,
      ...(fields !== null && {
        fields: `nextPageToken, drives(${stringifyFields_(fields)})`,
      }),
    });
    if (!SafeDrivesCollection_.driveListIsSafe(ret, fields)) {
      throw new Error("");
    }
    return ret;
  }
}
