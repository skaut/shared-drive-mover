import { type MockedObject, vi } from "vitest";

import type { MoveState_ } from "../../../src/backend/utils/MoveState";
import type { MoveContext } from "../../../src/interfaces/MoveContext";
import type { MoveError } from "../../../src/interfaces/MoveError";

export function mockedMoveState(): MockedObject<MoveState_> {
  // eslint-disable-next-line vitest/prefer-vi-mocked -- Acceptable as return value
  return {
    addPath:
      vi.fn<
        (sourceID: string, destinationID: string, path: Array<string>) => void
      >(),
    destroyState: vi.fn<() => void>(),
    getErrors: vi.fn<() => Array<MoveError>>(),
    getNextPath: vi.fn<() => MoveContext | null>(),
    isNull: vi.fn<() => boolean>(),
    loadState: vi.fn<() => void>(),
    logError: vi.fn<(file: Array<string>, error: string) => void>(),
    removePath: vi.fn<(path: MoveContext) => void>(),
    saveState: vi.fn<() => void>(),
    tryOrLog: vi.fn<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generics not supported
      (context: MoveContext, fn: () => any, filename?: string) => any
    >(),
  } as unknown as MockedObject<MoveState_>;
}
