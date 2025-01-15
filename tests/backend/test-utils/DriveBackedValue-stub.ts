import { type MockedObject, vi } from "vitest";

import type { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";
import type { MoveContext } from "../../../src/interfaces/MoveContext";
import type { MoveError } from "../../../src/interfaces/MoveError";

export function mockedDriveBackedValue(): MockedObject<
  DriveBackedValue_<{
    errors: Array<MoveError>;
    pathsToProcess: Array<MoveContext>;
  }>
> {
  // eslint-disable-next-line vitest/prefer-vi-mocked -- Acceptable as return value
  return {
    deleteValue: vi.fn(),
    loadValue: vi.fn(),
    saveValue: vi.fn(),
  } as unknown as MockedObject<
    DriveBackedValue_<{
      errors: Array<MoveError>;
      pathsToProcess: Array<MoveContext>;
    }>
  >;
}
