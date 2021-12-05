import type { MoveError } from "../../interfaces/MoveError";

export class ErrorLogger_ {
  private readonly errors: Array<MoveError>;

  public constructor() {
    this.errors = [];
  }

  public log(file: Array<string>, error: string): void {
    this.errors.push({ file, error });
  }

  public isEmpty(): boolean {
    return this.errors.length === 0;
  }

  public get(): Array<MoveError> {
    return this.errors;
  }
}
