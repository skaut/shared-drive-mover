import { type MockedObject, vi } from "vitest";

import type { MoveState_ } from "../../../src/backend/utils/MoveState";

export function mockedMoveState(): MockedObject<MoveState_> {
  return {
    addPath: vi.fn(),
    destroyState: vi.fn(),
    getErrors: vi.fn(),
    getNextPath: vi.fn(),
    isNull: vi.fn(),
    loadState: vi.fn(),
    logError: vi.fn(),
    removePath: vi.fn(),
    saveState: vi.fn(),
    tryOrLog: vi.fn(),
  } as unknown as MockedObject<MoveState_>;
}
