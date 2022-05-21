export class DriveBackedValue_<T> {
  private static readonly DriveFolderName = "Shared drive mover cache";

  private readonly hash: string;

  public constructor(key: string) {
    this.hash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      key,
      Utilities.Charset.US_ASCII
    )
      .map((byte) => (byte < 0 ? byte + 256 : byte).toString(16))
      .map((s) => (s.length < 2 ? "0" + s : s))
      .join("");
  }

  public saveValue(value: T): void {
    this.saveDriveFile(this.getDriveFolderId(), value);
  }

  public loadValue(): T | null {
    const folderId = this.getExistingDriveFolderId();
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
    const folderId = this.getExistingDriveFolderId();
    if (folderId === null) {
      return;
    }
    const fileId = this.getExistingDriveFileId(folderId);
    if (fileId !== null) {
      this.deleteExistingDriveFile(fileId);
    }
    if (this.isExistingDriveFolderEmpty(folderId)) {
      // This function works with folders as well
      this.deleteExistingDriveFile(folderId);
    }
  }

  private getDriveFolderId(): string {
    const folderId = this.getExistingDriveFolderId();
    if (folderId !== null) {
      return folderId;
    }
    return this.createDriveFolder();
  }

  private getExistingDriveFolderId(): string | null {
    const response = Drive.Files!.list({
      q:
        'title = "' +
        DriveBackedValue_.DriveFolderName +
        '" and "root" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
      maxResults: 1,
      fields: "items(id)",
    });
    if (
      response.items!.length === 1 &&
      typeof response.items![0].id === "string"
    ) {
      return response.items![0].id;
    }
    return null;
  }

  private createDriveFolder(): string {
    const response = Drive.Files!.insert({
      mimeType: "application/vnd.google-apps.folder",
      title: DriveBackedValue_.DriveFolderName,
    });
    return response.id!;
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
      q:
        'title = "' +
        this.getFileName() +
        '" and "' +
        folderId +
        '" in parents and trashed = false',
      maxResults: 1,
      fields: "items(id)",
    });
    if (
      response.items!.length === 1 &&
      typeof response.items![0].id === "string"
    ) {
      return response.items![0].id;
    }
    return null;
  }

  private updateExistingDriveFile(fileId: string, value: T): void {
    Drive.Files!.update(
      {},
      fileId,
      Utilities.newBlob(JSON.stringify(value), "application/json")
    );
  }

  private saveAsNewDriveFile(folderId: string, value: T): void {
    Drive.Files!.insert(
      {
        mimeType: "application/json",
        parents: [{ id: folderId }],
        title: this.getFileName(),
      },
      Utilities.newBlob(JSON.stringify(value), "application/json")
    );
  }

  private getExistingDriveFileContents(fileId: string): T {
    return JSON.parse(
      Drive.Files!.get(fileId, { alt: "media" }) as string
    ) as T;
  }

  private deleteExistingDriveFile(fileId: string): void {
    Drive.Files!.remove(fileId);
  }

  private isExistingDriveFolderEmpty(folderId: string): boolean {
    const response = Drive.Files!.list({
      q: '"' + folderId + '" in parents and trashed = false',
      maxResults: 1,
      fields: "items(id)",
    });
    return response.items!.length === 0;
  }

  private getFileName(): string {
    return "shared-drive-mover-state-" + this.hash + ".json";
  }
}
