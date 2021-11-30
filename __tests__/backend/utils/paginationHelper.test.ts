import { paginationHelper } from "../../src/backend/utils/paginationHelper";

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
    .fn<T, [pageToken: string | undefined]>()
    .mockReturnValueOnce(rawResponse);
  const transform = jest
    .fn<Array<string>, [response: T]>()
    .mockReturnValueOnce(["first", "second"]);

  expect(paginationHelper(request, transform)).toStrictEqual([
    "first",
    "second",
  ]);
  expect(request.mock.calls.length).toBe(1);
  expect(request.mock.calls[0][0]).toBe(undefined);
  expect(transform.mock.calls.length).toBe(1);
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
    .fn<T, [pageToken: string | undefined]>()
    .mockReturnValueOnce(rawResponse1)
    .mockReturnValueOnce(rawResponse2)
    .mockReturnValueOnce(rawResponse3);
  const transform = jest
    .fn<Array<string>, [response: T]>()
    .mockReturnValueOnce(["first", "second"])
    .mockReturnValueOnce(["third", "fourth"])
    .mockReturnValueOnce(["fifth", "sixth"]);

  expect(paginationHelper(request, transform)).toStrictEqual([
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
  ]);
  expect(request.mock.calls.length).toBe(3);
  expect(request.mock.calls[0][0]).toBe(undefined);
  expect(request.mock.calls[1][0]).toBe("token1");
  expect(request.mock.calls[2][0]).toBe("token2");
  expect(transform.mock.calls.length).toBe(3);
  expect(transform.mock.calls[0][0]).toStrictEqual(rawResponse1);
  expect(transform.mock.calls[1][0]).toStrictEqual(rawResponse2);
  expect(transform.mock.calls[2][0]).toStrictEqual(rawResponse3);
});
