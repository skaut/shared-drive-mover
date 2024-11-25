import type { DeepKeyof } from "../DeepKeyof";
import type { DeepPick } from "../DeepPick";

import { stringifyFields_ } from "./stringifyFields";

export interface SafeFile {
  capabilities: {
    canMoveItemOutOfDrive: boolean;
  };
  id: string;
  imageMediaMetadata?: {
    aperture: number;
  };
  mimeType: string;
  shortcutDetails?: {
    targetId: string;
  };
  title: string;
  userPermission: {
    role: "fileOrganizer" | "organizer" | "owner" | "reader" | "writer";
  };
}

const safeFileOptionalKeys = ["imageMediaMetadata", "shortcutDetails"];

const safeFileKeys: DeepKeyof<SafeFile> = {
  capabilities: {
    canMoveItemOutOfDrive: true,
  },
  id: true,
  imageMediaMetadata: {
    aperture: true,
  },
  mimeType: true,
  shortcutDetails: {
    targetId: true,
  },
  title: true,
  userPermission: {
    role: true,
  },
};

export interface SafeFileList<F extends DeepKeyof<SafeFile>> {
  items: Array<DeepPick<SafeFile, F>>;
  nextPageToken?: string | undefined;
}
interface GetArg {
  alt?: string;
}

type GetReturn<F extends DeepKeyof<SafeFile>, A extends GetArg> = A extends {
  alt: "media";
}
  ? string
  : DeepPick<SafeFile, F>;

export class SafeFilesCollection_ {
  private readonly unsafeFiles: GoogleAppsScript.Drive.Collection.FilesCollection;

  public constructor() {
    if (Drive.Files === undefined) {
      throw new Error();
    }
    this.unsafeFiles = Drive.Files;
  }

  private static fileIsSafe<F extends DeepKeyof<SafeFile>>(
    file: GoogleAppsScript.Drive.Schema.File,
    keys: F | null,
  ): file is typeof keys extends null ? SafeFile : DeepPick<SafeFile, F> {
    if (keys === null) {
      return SafeFilesCollection_.fileIsSafe(file, safeFileKeys);
    }
    for (const key in keys) {
      if (
        !Object.prototype.hasOwnProperty.call(keys, key) ||
        safeFileOptionalKeys.indexOf(key) > -1
      ) {
        continue;
      }
      if (file[key as keyof DeepKeyof<SafeFile>] === undefined) {
        return false;
      }
      if (typeof keys[key] === "object") {
        for (const innerKey in keys[key]) {
          if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- On purpose, we want to support arbitrary objects
            (file[key as keyof DeepKeyof<SafeFile>] as Record<string, any>)[
              innerKey
            ] === undefined
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private static fileListIsSafe<F extends DeepKeyof<SafeFile>>(
    fileList: GoogleAppsScript.Drive.Schema.FileList,
    keys: F | null,
  ): fileList is SafeFileList<F> {
    if (fileList.items === undefined) {
      return false;
    }
    return fileList.items.every((file) =>
      SafeFilesCollection_.fileIsSafe(file, keys),
    );
  }

  public copy<F extends DeepKeyof<SafeFile>>(
    resource: GoogleAppsScript.Drive.Schema.File,
    fileId: string,
    fields: F | null,
    optionalArgs: {
      supportsAllDrives?: boolean;
    } = {},
  ): DeepPick<SafeFile, F> {
    const ret = this.unsafeFiles.copy(resource, fileId, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (!SafeFilesCollection_.fileIsSafe(ret, fields)) {
      throw new Error("");
    }
    return ret;
  }

  public get<F extends DeepKeyof<SafeFile>, A extends GetArg>(
    fileId: string,
    fields: F | null,
    optionalArgs: A = {} as A,
  ): GetReturn<F, A> {
    const ret = this.unsafeFiles.get(fileId, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (
      typeof ret !== "string" &&
      !SafeFilesCollection_.fileIsSafe(ret, fields)
    ) {
      throw new Error("");
    }
    return ret as unknown as GetReturn<F, A>;
  }

  public insert<F extends DeepKeyof<SafeFile>>(
    resource: GoogleAppsScript.Drive.Schema.File,
    fields: F | null,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- Required by the Drive API
    mediaData?: any,
    optionalArgs: {
      supportsAllDrives?: boolean;
    } = {},
  ): DeepPick<SafeFile, F> {
    const ret = this.unsafeFiles.insert(resource, mediaData, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (!SafeFilesCollection_.fileIsSafe(ret, fields)) {
      throw new Error("");
    }
    return ret;
  }

  public list<F extends DeepKeyof<SafeFile>>(
    fields: F | null,
    optionalArgs: {
      includeItemsFromAllDrives?: boolean;
      maxResults?: number;
      pageToken?: string | undefined;
      q?: string;
      supportsAllDrives?: boolean;
    } = {},
  ): SafeFileList<F> {
    const ret = this.unsafeFiles.list({
      ...optionalArgs,
      ...(fields !== null && {
        fields: `nextPageToken, items(${stringifyFields_(fields)})`,
      }),
    });
    if (!SafeFilesCollection_.fileListIsSafe(ret, fields)) {
      throw new Error("");
    }
    return ret;
  }

  public remove(fileId: string): void {
    this.unsafeFiles.remove(fileId);
  }

  public update<F extends DeepKeyof<SafeFile>>(
    resource: GoogleAppsScript.Drive.Schema.File,
    fileId: string,
    fields: F | null,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- Required by the Drive API
    mediaData?: any,
    optionalArgs: {
      addParents?: string;
      removeParents?: string;
      supportsAllDrives?: boolean;
    } = {},
  ): DeepPick<SafeFile, F> {
    const ret = this.unsafeFiles.update(resource, fileId, mediaData, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (!SafeFilesCollection_.fileIsSafe(ret, fields)) {
      throw new Error("");
    }
    return ret;
  }
}
