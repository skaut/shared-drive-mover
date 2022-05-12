export class DriveBackedValue_<T> {
  private static readonly DriveFolderName = "Shared drive mover cache";

  private readonly key: string;

  public constructor(key: string) {
    this.key = key;
  }

  public saveValue(value: T): void {
    let stateFolderId = this.getStateFolder();
    if (stateFolderId === null) {
      stateFolderId = this.createStateFolder();
    }
    this.saveStateFile(stateFolderId, value);
  }

  private getStateFolder(): string | null {
    const response = Drive.Files!.list({
      q:
        "title = '" +
        DriveBackedValue_.DriveFolderName +
        '\' and "root" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
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

  private createStateFolder(): string {
    const response = Drive.Files!.insert({
      mimeType: "application/vnd.google-apps.folder",
      title: DriveBackedValue_.DriveFolderName,
    });
    return response.id!;
  }

  private saveStateFile(stateFolderId: string, value: T): void {
    const hash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      this.key,
      Utilities.Charset.US_ASCII
    )
      .map((byte) => (byte < 0 ? byte + 256 : byte).toString(16).slice(-2))
      .join("");
    Drive.Files!.insert(
      {
        mimeType: "application/json",
        parents: [{ id: stateFolderId }],
        title: "shared-drive-mover-state-" + hash + ".json",
      },
      Utilities.newBlob(JSON.stringify(value), "application/json")
    );
  }
}
