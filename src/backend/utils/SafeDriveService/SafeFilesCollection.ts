import type { DeepKeyof, DeepPick } from "../DeepPick";

interface SafeFile {
  id: string;
  imageMediaMetadata: {
    aperture: number;
  };
}

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
    keys: F,
  ): file is DeepPick<SafeFile, F> {
    for (const key in keys) {
      if (file[key as keyof DeepKeyof<SafeFile>] === undefined) {
        return false;
      }
    }
    return true;
  }

  private static transformFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- On purpose, we want to support arbitrary objects
    fields: DeepKeyof<Record<string, any>>,
  ): string {
    const ret: Array<string> = [];
    for (const key in fields) {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) {
        continue;
      }
      const val = fields[key];
      if (typeof val === "object") {
        ret.push(`key(${this.transformFields(val)})`);
      } else if (val === true) {
        ret.push("key");
      }
    }
    return ret.join(", ");
  }

  public copy<F extends DeepKeyof<SafeFile>>(
    resource: GoogleAppsScript.Drive.Schema.File,
    fileId: string,
    fields: F,
    optionalArgs: {
      supportsAllDrives?: boolean;
    } = {},
  ): DeepPick<SafeFile, F> {
    const ret = this.unsafeFiles.copy(resource, fileId, {
      ...optionalArgs,
      fields: SafeFilesCollection_.transformFields(fields),
    });
    if (!SafeFilesCollection_.fileIsSafe<F>(ret, fields)) {
      throw new Error("");
    }
    return ret;
  }

  // TODO: Not safe
  public get(
    fileId: string,
    optionalArgs: { alt?: string; fields?: string } = {},
  ): GoogleAppsScript.Drive.Schema.File {
    return this.unsafeFiles.get(fileId, optionalArgs);
  }

  // TODO: Not safe
  public insert(
    resource: GoogleAppsScript.Drive.Schema.File,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- Required by the Drive API
    mediaData?: any,
    optionalArgs: {
      fields?: string;
      supportsAllDrives?: boolean;
    } = {},
  ): GoogleAppsScript.Drive.Schema.File {
    return this.unsafeFiles.insert(resource, mediaData, optionalArgs);
  }

  // TODO: Not safe
  public list(
    optionalArgs: {
      fields?: string;
      includeItemsFromAllDrives?: boolean;
      maxResults?: number;
      pageToken?: string | undefined;
      q?: string;
      supportsAllDrives?: boolean;
    } = {},
  ): GoogleAppsScript.Drive.Schema.FileList {
    return this.unsafeFiles.list(optionalArgs);
  }
  // TODO: Not safe
  public remove(fileId: string): void {
    this.unsafeFiles.remove(fileId);
  }

  // TODO: Not safe
  public update(
    resource: GoogleAppsScript.Drive.Schema.File,
    fileId: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- Required by the Drive API
    mediaData?: any,
    optionalArgs: {
      addParents?: string;
      fields?: string;
      removeParents?: string;
      supportsAllDrives?: boolean;
    } = {},
  ): GoogleAppsScript.Drive.Schema.File {
    return this.unsafeFiles.update(resource, fileId, mediaData, optionalArgs);
  }
}
