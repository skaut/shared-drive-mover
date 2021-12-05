export class ErrorLogger_<T> {
  private readonly errors: Array<T>;

  public constructor() {
    this.errors = [];
  }

  public log(error: T): void {
    this.errors.push(error);
  }

  public logMultiple(errors: Array<T>): void {
    this.errors.push(...errors);
  }

  public isEmpty(): boolean {
    return this.errors.length === 0;
  }

  public get(): Array<T> {
    return this.errors;
  }
}
