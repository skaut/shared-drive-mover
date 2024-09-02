import type { MockedObject } from "jest-mock";

import { jest } from "@jest/globals";

import type { DriveBackedValue_ } from "../../src/backend/utils/DriveBackedValue";
import type { MoveContext } from "../../src/interfaces/MoveContext";
import type { MoveError } from "../../src/interfaces/MoveError";

export function mockedDriveBackedValue(): MockedObject<
  DriveBackedValue_<{
    errors: Array<MoveError>;
    pathsToProcess: Array<MoveContext>;
  }>
> {
  return {
    deleteValue: jest.fn(),
    loadValue: jest.fn(),
    saveValue: jest.fn(),
  } as unknown as MockedObject<
    DriveBackedValue_<{
      errors: Array<MoveError>;
      pathsToProcess: Array<MoveContext>;
    }>
  >;
}
