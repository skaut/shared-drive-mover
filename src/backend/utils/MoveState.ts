import { DriveBackedValue_ } from "./DriveBackedValue";

export class MoveState_ {
  private readonly driveBackedState: DriveBackedValue_<{ key: string }>;

  public constructor(
    sourceID: string,
    destinationID: string,
    copyComments: boolean,
    mergeFolders: boolean
  ) {
    this.driveBackedState = new DriveBackedValue_(
      JSON.stringify({
        sourceID,
        destinationID,
        copyComments,
        mergeFolders,
      })
    );
  }

  public saveState(): void {
    this.driveBackedState.saveValue({ key: "val" });
  }
}
