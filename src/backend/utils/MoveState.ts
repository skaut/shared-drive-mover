import { DriveBackedValue_ } from "./DriveBackedValue";

type MoveStateType = Array<{
  sourceID: string;
  destinationID: string;
  path: Array<string>;
}>;

export class MoveState_ {
  private readonly driveBackedState: DriveBackedValue_<MoveStateType>;
  private state: MoveStateType | null;

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
    this.state = null;
  }

  public isNull(): boolean {
    return this.state === null;
  }

  public saveState(): void {
    if (this.state !== null) {
      this.driveBackedState.saveValue(this.state);
    }
  }

  public loadState(): void {
    this.state = this.driveBackedState.loadValue();
  }

  public addPath(
    sourceID: string,
    destinationID: string,
    path: Array<string>
  ): void {
    if (this.state === null) {
      this.state = [];
    }
    this.state.push({ sourceID, destinationID, path });
  }
}
