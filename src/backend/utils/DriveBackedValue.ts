export class DriveBackedValue_<T> {
  private static readonly driveFolderName = "Shared drive mover cache";

  private readonly hash: string;

  public constructor(key: string) {
    this.hash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      key,
      Utilities.Charset.US_ASCII,
    )
      .map((byte) => (byte < 0 ? byte + 256 : byte).toString(16))
      .map((s) => (s.length < 2 ? `0${s}` : s))
      .join("");
  }

  private static getDriveFolderId(): string {
    const folderId = DriveBackedValue_.getExistingDriveFolderId();
    if (folderId !== null) {
      return folderId;
    }
    return DriveBackedValue_.createDriveFolder();
  }

  private static getExistingDriveFolderId(): string | null {
    const response = Drive.Files!.list({
      fields: "items(id)",
      maxResults: 1,
      q:
        `title = "${DriveBackedValue_.driveFolderName}" and "root" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false`,
    });
    if (
      response.items!.length === 1 &&
      typeof response.items![0].id === "string"
    ) {
      return response.items![0].id;
    }
    return null;
  }

  private static createDriveFolder(): string {
    const response = Drive.Files!.insert({
      mimeType: "application/vnd.google-apps.folder",
      title: DriveBackedValue_.driveFolderName,
    });
    return response.id!;
  }

  private static deleteExistingDriveFile(fileId: string): void {
    Drive.Files!.remove(fileId);
  }

  private static isExistingDriveFolderEmpty(folderId: string): boolean {
    const response = Drive.Files!.list({
      fields: "items(id)",
      maxResults: 1,
      q: `"${folderId}" in parents and trashed = false`,
    });
    return response.items!.length === 0;
  }

  public saveValue(value: T): void {
    this.saveDriveFile(DriveBackedValue_.getDriveFolderId(), value);
  }

  public loadValue(): T | null {
    const folderId = DriveBackedValue_.getExistingDriveFolderId();
    if (folderId === null) {
      return null;
    }
    const fileId = this.getExistingDriveFileId(folderId);
    if (fileId === null) {
      return null;
    }
    return this.getExistingDriveFileContents(fileId);
  }

  public deleteValue(): void {
    const folderId = DriveBackedValue_.getExistingDriveFolderId();
    if (folderId === null) {
      return;
    }
    const fileId = this.getExistingDriveFileId(folderId);
    if (fileId !== null) {
      DriveBackedValue_.deleteExistingDriveFile(fileId);
    }
    if (DriveBackedValue_.isExistingDriveFolderEmpty(folderId)) {
      // This function works with folders as well
      DriveBackedValue_.deleteExistingDriveFile(folderId);
    }
  }

  private saveDriveFile(folderId: string, value: T): void {
    const fileId = this.getExistingDriveFileId(folderId);
    if (fileId !== null) {
      this.updateExistingDriveFile(fileId, value);
    } else {
      this.saveAsNewDriveFile(folderId, value);
    }
  }

  private getExistingDriveFileId(folderId: string): string | null {
    const response = Drive.Files!.list({
      fields: "items(id)",
      maxResults: 1,
      q:
        `title = "${this.getFileName()}" and "${folderId}" in parents and trashed = false`,
    });
    if (
      response.items!.length === 1 &&
      typeof response.items![0].id === "string"
    ) {
      return response.items![0].id;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- Static methods cannot access T
  private updateExistingDriveFile(fileId: string, value: T): void {
    Drive.Files!.update(
      {},
      fileId,
      Utilities.newBlob(JSON.stringify(value), "application/json"),
    );
  }

  private saveAsNewDriveFile(folderId: string, value: T): void {
    Drive.Files!.insert(
      {
        mimeType: "application/json",
        parents: [{ id: folderId }],
        title: this.getFileName(),
      },
      Utilities.newBlob(JSON.stringify(value), "application/json"),
    );
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- Static methods cannot access T
  private getExistingDriveFileContents(fileId: string): T {
    return JSON.parse(
      Drive.Files!.get(fileId, { alt: "media" }) as string,
    ) as T;
  }

  private getFileName(): string {
    return `shared-drive-mover-state-${this.hash}.json`;
  }
}
