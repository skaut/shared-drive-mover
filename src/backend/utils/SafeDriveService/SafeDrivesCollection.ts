import type { DeepKeyof } from "../DeepKeyof";
import type { DeepPick } from "../DeepPick";

import { stringifyFields_ } from "./stringifyFields";

export interface SafeDrive {
  id: string;
  name: string;
}

export interface SafeDriveList<F extends DeepKeyof<SafeDrive>> {
  items: Array<DeepPick<SafeDrive, F>>;
  nextPageToken?: string;
}

const safeDriveKeys: DeepKeyof<SafeDrive> = {
  id: true,
  name: true,
};

export class SafeDrivesCollection_ {
  private readonly unsafeDrives: GoogleAppsScript.Drive.Collection.DrivesCollection;

  public constructor() {
    if (Drive.Drives === undefined) {
      throw new Error();
    }
    this.unsafeDrives = Drive.Drives;
  }

  private static driveIsSafe<F extends DeepKeyof<SafeDrive>>(
    drive: GoogleAppsScript.Drive.Schema.Drive,
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
    driveList: GoogleAppsScript.Drive.Schema.DriveList,
    keys: F | null,
  ): driveList is SafeDriveList<F> {
    if (driveList.items === undefined) {
      return false;
    }
    return driveList.items.every((file) =>
      SafeDrivesCollection_.driveIsSafe(file, keys),
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
        fields: `nextPageToken, items(${stringifyFields_(fields)})`,
      }),
    });
    if (!SafeDrivesCollection_.driveListIsSafe(ret, fields)) {
      throw new Error("");
    }
    return ret;
  }
}
