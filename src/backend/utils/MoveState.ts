import { DriveBackedValue_ } from "./DriveBackedValue";

import type { MoveContextv2_ } from "../../interfaces/MoveContext";
import type { MoveError } from "../../interfaces/MoveError";

export class MoveState_ {
  private readonly driveBackedState: DriveBackedValue_<{
    pathsToProcess: Array<MoveContextv2_>;
    errors: Array<MoveError>;
  }>;
  private pathsToProcess: Array<MoveContextv2_> | null;
  private errors: Array<MoveError>;

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
    this.pathsToProcess = null;
    this.errors = [];
  }

  public isNull(): boolean {
    return this.pathsToProcess === null;
  }

  public isEmpty(): boolean {
    return this.pathsToProcess === null || this.pathsToProcess.length === 0;
  }

  public getErrors(): Array<MoveError> {
    return this.errors;
  }

  public addPath(
    sourceID: string,
    destinationID: string,
    path: Array<string>
  ): void {
    if (this.pathsToProcess === null) {
      this.pathsToProcess = [];
    }
    this.pathsToProcess.push({ sourceID, destinationID, path });
  }

  public saveState(): void {
    if (this.pathsToProcess !== null) {
      this.driveBackedState.saveValue({
        pathsToProcess: this.pathsToProcess,
        errors: this.errors,
      });
    }
  }

  public loadState(): void {
    const state = this.driveBackedState.loadValue();
    if (state !== null) {
      this.pathsToProcess = state.pathsToProcess;
      this.errors = state.errors;
    } else {
      this.pathsToProcess = null;
      this.errors = [];
    }
  }

  public destroyState(): void {
    this.driveBackedState.deleteValue();
    this.pathsToProcess = null;
    this.errors = [];
  }
}
