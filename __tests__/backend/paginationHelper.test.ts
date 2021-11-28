test("paginationHelper works correctly", () => {
  const request = (): { nextPageToken: string | undefined } => ({
    nextPageToken: undefined,
  });
  const transform = (): Array<string> => ["first", "second"];
  expect(paginationHelper(request, transform)).toStrictEqual([
    "first",
    "second",
  ]);
});
