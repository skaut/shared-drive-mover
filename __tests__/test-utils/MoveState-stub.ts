import type { MockedObject } from "jest-mock";

import { jest } from "@jest/globals";

import type { MoveState_ } from "../../src/backend/utils/MoveState";

export function mockedMoveState(): MockedObject<MoveState_> {
  return {
    addPath: jest.fn(),
    destroyState: jest.fn(),
    getErrors: jest.fn(),
    getNextPath: jest.fn(),
    isNull: jest.fn(),
    loadState: jest.fn(),
    logError: jest.fn(),
    removePath: jest.fn(),
    saveState: jest.fn(),
    tryOrLog: jest.fn(),
  } as unknown as MockedObject<MoveState_>;
}
