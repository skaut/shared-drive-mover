import type { SafeDriveService_ } from "./SafeDriveService";

export class DriveBackedValue_<T> {
  private static readonly driveFolderName = "Shared drive mover cache";

  private readonly driveService: SafeDriveService_;
  private readonly hash: string;

  public constructor(key: string, driveService: SafeDriveService_) {
    this.driveService = driveService;
    this.hash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      key,
      Utilities.Charset.US_ASCII,
    )
      .map((byte) => (byte < 0 ? byte + 256 : byte).toString(16))
      .map((s) => (s.length < 2 ? `0${s}` : s))
      .join("");
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

  public saveValue(value: T): void {
    this.saveDriveFile(this.getDriveFolderId(), value);
  }

  private createDriveFolder(): string {
    const response = this.driveService.Files.create(
      {
        mimeType: "application/vnd.google-apps.folder",
        name: DriveBackedValue_.driveFolderName,
      },
      {
        id: true,
      },
    );
    return response.id;
  }

  private deleteExistingDriveFile(fileId: string): void {
    this.driveService.Files.remove(fileId);
  }

  private getDriveFolderId(): string {
    const folderId = this.getExistingDriveFolderId();
    if (folderId !== null) {
      return folderId;
    }
    return this.createDriveFolder();
  }

  private getExistingDriveFileContents(fileId: string): T {
    return this.driveService.Files.get(fileId, null, {
      alt: "media" as const,
    }) as T;
  }

  private getExistingDriveFileId(folderId: string): string | null {
    const response = this.driveService.Files.list(
      { id: true },
      {
        maxResults: 1,
        q: `name = "${this.getFileName()}" and "${folderId}" in parents and trashed = false`,
      },
    );
    if (
      response.files.length === 1 &&
      typeof response.files[0].id === "string"
    ) {
      return response.files[0].id;
    }
    return null;
  }

  private getExistingDriveFolderId(): string | null {
    const response = this.driveService.Files.list(
      { id: true },
      {
        maxResults: 1,
        q: `name = "${DriveBackedValue_.driveFolderName}" and "root" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false`,
      },
    );
    if (
      response.files.length === 1 &&
      typeof response.files[0].id === "string"
    ) {
      return response.files[0].id;
    }
    return null;
  }

  private getFileName(): string {
    return `shared-drive-mover-state-${this.hash}.json`;
  }

  private isExistingDriveFolderEmpty(folderId: string): boolean {
    const response = this.driveService.Files.list(
      { id: true },
      {
        maxResults: 1,
        q: `"${folderId}" in parents and trashed = false`,
      },
    );
    return response.files.length === 0;
  }

  private saveAsNewDriveFile(folderId: string, value: T): void {
    this.driveService.Files.create(
      {
        mimeType: "application/json",
        name: this.getFileName(),
        parents: [folderId],
      },
      {},
      Utilities.newBlob(JSON.stringify(value), "application/json"),
    );
  }

  private saveDriveFile(folderId: string, value: T): void {
    const fileId = this.getExistingDriveFileId(folderId);
    if (fileId !== null) {
      this.updateExistingDriveFile(fileId, value);
    } else {
      this.saveAsNewDriveFile(folderId, value);
    }
  }

  private updateExistingDriveFile(fileId: string, value: T): void {
    this.driveService.Files.update(
      {},
      fileId,
      {},
      Utilities.newBlob(JSON.stringify(value), "application/json"),
    );
  }
}
