export class MoveState_ {
  private static readonly stateFolderName = "Shared drive mover cache";

  private readonly sourceID: string;
  private readonly destinationID: string;
  private readonly copyComments: boolean;
  private readonly mergeFolders: boolean;

  public constructor(
    sourceID: string,
    destinationID: string,
    copyComments: boolean,
    mergeFolders: boolean
  ) {
    this.sourceID = sourceID;
    this.destinationID = destinationID;
    this.copyComments = copyComments;
    this.mergeFolders = mergeFolders;
  }

  public saveState(): void {
    let stateFolderId = this.getStateFolder();
    if (stateFolderId === null) {
      stateFolderId = this.createStateFolder();
    }
    this.saveStateFile(stateFolderId);
  }

  private getStateFolder(): string | null {
    const response = Drive.Files!.list({
      q:
        "title = '" +
        MoveState_.stateFolderName +
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
    const response = Drive.Files!.insert(
      {
        mimeType: "application/vnd.google-apps.folder",
        title: MoveState_.stateFolderName,
      },
      null
    );
    return response.id!;
  }

  private saveStateFile(stateFolderId: string): void {
    const contents = {
      key: "val",
    };
    const hash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      JSON.stringify({
        sourceID: this.sourceID,
        destinationID: this.destinationID,
        copyComments: this.copyComments,
        mergeFolders: this.mergeFolders,
      }),
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
      Utilities.newBlob(JSON.stringify(contents), "application/json"),
      {
        supportsAllDrives: true,
      }
    );
  }
}
