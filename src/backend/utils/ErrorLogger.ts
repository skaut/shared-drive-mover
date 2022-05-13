import type { MoveContextv2_ } from "../../interfaces/MoveContext";
import type { MoveError } from "../../interfaces/MoveError";

export class ErrorLogger_ {
  private errors: Array<MoveError>;

  public constructor() {
    this.errors = [];
  }

  // TODO: save state on each log?
  public log(file: Array<string>, error: string): void {
    this.errors.push({ file, error });
  }

  public isEmpty(): boolean {
    return this.errors.length === 0;
  }

  public get(): Array<MoveError> {
    return this.errors;
  }

  public set(errors: Array<MoveError>): void {
    this.errors = errors;
  }

  public tryOrLog<T>(context: MoveContextv2_, fn: () => T): T | null {
    try {
      return fn();
    } catch (e) {
      this.log(context.path, (e as Error).message);
    }
    return null;
  }
}
