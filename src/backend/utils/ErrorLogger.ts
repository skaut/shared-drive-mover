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

  public tryOrLog<T>(
    context: MoveContextv2_,
    fn: () => T,
    filename?: string
  ): T | null {
    try {
      return fn();
    } catch (e) {
      const path =
        filename !== undefined ? context.path.concat([filename]) : context.path;
      this.log(path, (e as Error).message);
    }
    return null;
  }
}
