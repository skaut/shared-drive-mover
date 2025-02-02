import { type MockedObject, vi } from "vitest";

import type { DriveBackedValue_ } from "../../../src/backend/utils/DriveBackedValue";
import type { MoveContext } from "../../../src/interfaces/MoveContext";
import type { MoveError } from "../../../src/interfaces/MoveError";

interface T {
  errors: Array<MoveError>;
  pathsToProcess: Array<MoveContext>;
}

export function mockedDriveBackedValue(): MockedObject<
  DriveBackedValue_<{
    errors: Array<MoveError>;
    pathsToProcess: Array<MoveContext>;
  }>
> {
  // eslint-disable-next-line vitest/prefer-vi-mocked -- Acceptable as return value
  return {
    deleteValue: vi.fn<() => void>(),
    loadValue: vi.fn<() => T | null>(),
    saveValue: vi.fn<(value: T) => void>(),
  } as unknown as MockedObject<DriveBackedValue_<T>>;
}
