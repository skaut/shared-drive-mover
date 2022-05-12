export class DriveBackedValue_<T> {
  private static readonly DriveFolderName = "Shared drive mover cache";

  private readonly hash: string;

  public constructor(key: string) {
    this.hash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      key,
      Utilities.Charset.US_ASCII
    )
      .map((byte) => (byte < 0 ? byte + 256 : byte).toString(16).slice(-2))
      .join("");
  }

  public saveValue(value: T): void {
    this.saveDriveFile(this.getDriveFolderId(), value);
  }

  private getDriveFolderId(): string {
    const stateFolderId = this.getExistingDriveFolderId();
    if (stateFolderId !== null) {
      return stateFolderId;
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
      response.items!.length > 0 &&
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

  private saveDriveFile(stateFolderId: string, value: T): void {
    const fileId = this.getExistingDriveFileId(stateFolderId);
    if (fileId !== null) {
      this.updateExistingDriveFile(fileId, value);
    } else {
      this.saveAsNewDriveFile(stateFolderId, value);
    }
  }

  private getExistingDriveFileId(stateFolderId: string): string | null {
    const response = Drive.Files!.list({
      q:
        'title = "' +
        this.getFileName() +
        '" and "' +
        stateFolderId +
        '" in parents and trashed = false',
      maxResults: 1,
      fields: "items(id)",
    });
    if (
      response.items!.length > 0 &&
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

  private saveAsNewDriveFile(stateFolderId: string, value: T): void {
    Drive.Files!.insert(
      {
        mimeType: "application/json",
        parents: [{ id: stateFolderId }],
        title: this.getFileName(),
      },
      Utilities.newBlob(JSON.stringify(value), "application/json")
    );
  }

  private getFileName(): string {
    return "shared-drive-mover-state-" + this.hash + ".json";
  }
}
