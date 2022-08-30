import { jest } from "@jest/globals";
import type { MockedObject } from "jest-mock";

import type { DriveBackedValue_ } from "../../src/backend/utils/DriveBackedValue";
import type { MoveContext } from "../../src/interfaces/MoveContext";
import type { MoveError } from "../../src/interfaces/MoveError";

export function mockedDriveBackedValue(): MockedObject<
  DriveBackedValue_<{
    pathsToProcess: Array<MoveContext>;
    errors: Array<MoveError>;
  }>
> {
  return {
    saveValue: jest.fn(),
    loadValue: jest.fn(),
    deleteValue: jest.fn(),
  } as unknown as MockedObject<
    DriveBackedValue_<{
      pathsToProcess: Array<MoveContext>;
      errors: Array<MoveError>;
    }>
  >;
}
