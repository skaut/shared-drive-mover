import { expect, test, vi } from "vitest";

import { paginationHelper_ } from "../../../src/backend/utils/paginationHelper";

test("paginationHelper works correctly", () => {
  interface T {
    a: string;
    nextPageToken?: string;
  }
  const rawResponse = {
    a: "b",
  };

  const request = vi
    .fn<(pageToken: string | undefined) => T>()
    .mockReturnValueOnce(rawResponse);
  const transform = vi
    .fn<(response: T) => Array<string>>()
    .mockReturnValueOnce(["first", "second"]);

  expect(paginationHelper_(request, transform)).toStrictEqual([
    "first",
    "second",
  ]);
  expect(request.mock.calls).toHaveLength(1);
  expect(request.mock.calls[0][0]).toBeUndefined();
  expect(transform.mock.calls).toHaveLength(1);
  expect(transform.mock.calls[0][0]).toStrictEqual(rawResponse);
});

test("paginationHelper works correctly with multiple pages", () => {
  interface T {
    a: string;
    nextPageToken?: string;
  }
  const rawResponse1 = {
    a: "b",
    nextPageToken: "token1",
  };
  const rawResponse2 = {
    a: "c",
    nextPageToken: "token2",
  };
  const rawResponse3 = {
    a: "c",
  };

  const request = vi
    .fn<(pageToken: string | undefined) => T>()
    .mockReturnValueOnce(rawResponse1)
    .mockReturnValueOnce(rawResponse2)
    .mockReturnValueOnce(rawResponse3);
  const transform = vi
    .fn<(response: T) => Array<string>>()
    .mockReturnValueOnce(["first", "second"])
    .mockReturnValueOnce(["third", "fourth"])
    .mockReturnValueOnce(["fifth", "sixth"]);

  expect(paginationHelper_(request, transform)).toStrictEqual([
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
  ]);
  expect(request.mock.calls).toHaveLength(3);
  expect(request.mock.calls[0][0]).toBeUndefined();
  expect(request.mock.calls[1][0]).toBe("token1");
  expect(request.mock.calls[2][0]).toBe("token2");
  expect(transform.mock.calls).toHaveLength(3);
  expect(transform.mock.calls[0][0]).toStrictEqual(rawResponse1);
  expect(transform.mock.calls[1][0]).toStrictEqual(rawResponse2);
  expect(transform.mock.calls[2][0]).toStrictEqual(rawResponse3);
});
