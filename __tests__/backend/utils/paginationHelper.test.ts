import { expect, jest, test } from "@jest/globals";

import { paginationHelper_ } from "../../../src/backend/utils/paginationHelper";

test("paginationHelper works correctly", () => {
  interface T {
    nextPageToken?: string;
    a: string;
  }
  const rawResponse = {
    nextPageToken: undefined,
    a: "b",
  };

  const request = jest
    .fn<(pageToken: string | undefined) => T>()
    .mockReturnValueOnce(rawResponse);
  const transform = jest
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
    nextPageToken?: string;
    a: string;
  }
  const rawResponse1 = {
    nextPageToken: "token1",
    a: "b",
  };
  const rawResponse2 = {
    nextPageToken: "token2",
    a: "c",
  };
  const rawResponse3 = {
    nextPageToken: undefined,
    a: "c",
  };

  const request = jest
    .fn<(pageToken: string | undefined) => T>()
    .mockReturnValueOnce(rawResponse1)
    .mockReturnValueOnce(rawResponse2)
    .mockReturnValueOnce(rawResponse3);
  const transform = jest
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
