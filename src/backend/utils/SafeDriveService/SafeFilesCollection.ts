import type { DeepKeyof } from "../DeepKeyof";
import type { DeepPick } from "../DeepPick";

import { stringifyFields_ } from "./stringifyFields";

export interface SafeFile {
  capabilities: {
    canDelete: boolean;
    canMoveItemOutOfDrive: boolean;
  };
  id: string;
  imageMediaMetadata?: {
    aperture: number;
  };
  mimeType: string;
  name: string;
  shortcutDetails?: {
    targetId: string;
  };
}

const safeFileOptionalKeys = ["imageMediaMetadata", "shortcutDetails"];

const safeFileKeys: DeepKeyof<SafeFile> = {
  capabilities: {
    canDelete: true,
    canMoveItemOutOfDrive: true,
  },
  id: true,
  imageMediaMetadata: {
    aperture: true,
  },
  mimeType: true,
  name: true,
  shortcutDetails: {
    targetId: true,
  },
};

export interface SafeFileList<F extends DeepKeyof<SafeFile>> {
  files: Array<DeepPick<SafeFile, F>>;
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

function fileIsSafe_<F extends DeepKeyof<SafeFile>>(
  file: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
  keys: F | null,
): file is typeof keys extends null ? SafeFile : DeepPick<SafeFile, F> {
  if (keys === null) {
    return fileIsSafe_(file, safeFileKeys);
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

function fileListIsSafe_<F extends DeepKeyof<SafeFile>>(
  fileList: GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileList,
  keys: F | null,
): fileList is SafeFileList<F> {
  return fileList.files?.every((file) => fileIsSafe_(file, keys)) === true;
}

export const SafeFilesCollection_ = {
  copy: <F extends DeepKeyof<SafeFile>>(
    resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
    fileId: string,
    fields: F | null,
    optionalArgs: {
      supportsAllDrives?: boolean;
    } = {},
  ): DeepPick<SafeFile, F> => {
    const ret = Drive.Files.copy(resource, fileId, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (!fileIsSafe_(ret, fields)) {
      throw new Error("Files.copy: File is not safe.");
    }
    return ret;
  },

  create: <F extends DeepKeyof<SafeFile>>(
    resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
    fields: F | null,
    mediaData?: GoogleAppsScript.Base.Blob,
    optionalArgs: {
      supportsAllDrives?: boolean;
    } = {},
  ): DeepPick<SafeFile, F> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Due to strange optional arguments on upstream types
    const ret = Drive.Files.create(resource, mediaData!, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (!fileIsSafe_(ret, fields)) {
      throw new Error("Files.create: File is not safe.");
    }
    return ret;
  },

  get: <F extends DeepKeyof<SafeFile>, A extends GetArg>(
    fileId: string,
    fields: F | null,
    optionalArgs: A = {} as A,
  ): GetReturn<F, A> => {
    const ret = Drive.Files.get(fileId, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (typeof ret !== "string" && !fileIsSafe_(ret, fields) && !("alt" in optionalArgs && optionalArgs.alt === "media")) {
      throw new Error("Files.get: File is not safe.");
    }
    return ret as unknown as GetReturn<F, A>;
  },

  list: <F extends DeepKeyof<SafeFile>>(
    fields: F | null,
    optionalArgs: {
      includeItemsFromAllDrives?: boolean;
      maxResults?: number;
      pageToken?: string | undefined;
      q?: string;
      supportsAllDrives?: boolean;
    } = {},
  ): SafeFileList<F> => {
    const ret = Drive.Files.list({
      ...optionalArgs,
      ...(fields !== null && {
        fields: `nextPageToken, files(${stringifyFields_(fields)})`,
      }),
    });
    if (!fileListIsSafe_(ret, fields)) {
      throw new Error("Files.list: File list is not safe.");
    }
    return ret;
  },

  remove: (fileId: string): void => {
    Drive.Files.remove(fileId);
  },

  update: <F extends DeepKeyof<SafeFile>>(
    resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
    fileId: string,
    fields: F | null,
    mediaData?: GoogleAppsScript.Base.Blob,
    optionalArgs: {
      addParents?: string;
      removeParents?: string;
      supportsAllDrives?: boolean;
    } = {},
  ): DeepPick<SafeFile, F> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Strange behaviour with optional arguments
    const ret = Drive.Files.update(resource, fileId, mediaData!, {
      ...optionalArgs,
      ...(fields !== null && {
        fields: stringifyFields_(fields),
      }),
    });
    if (!fileIsSafe_(ret, fields)) {
      throw new Error("Files.update: File is not safe.");
    }
    return ret;
  },
};
