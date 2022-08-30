import { jest } from "@jest/globals";
import type { MockedObject } from "jest-mock";

import type { MoveState_ } from "../../src/backend/utils/MoveState";

export function mockedMoveState(): MockedObject<MoveState_> {
  return {
    isNull: jest.fn(),
    getNextPath: jest.fn(),
    addPath: jest.fn(),
    removePath: jest.fn(),
    getErrors: jest.fn(),
    logError: jest.fn(),
    tryOrLog: jest.fn(),
    saveState: jest.fn(),
    loadState: jest.fn(),
    destroyState: jest.fn(),
  } as unknown as MockedObject<MoveState_>;
}
