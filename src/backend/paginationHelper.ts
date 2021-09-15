/* exported paginationHelper */

async function paginationHelper<
  T extends { nextPageToken?: string | undefined }
>(
  request: (pageToken: string | undefined) => T,
  transform: (response: T) => Array<NamedRecord>,
  maxTotalDelayInSeconds: number
): Promise<Array<NamedRecord>> {
  let ret: Array<NamedRecord> = [];
  let pageToken: string | undefined = undefined;
  do {
    const response = await backoffHelper<T>(
      () => request(pageToken),
      maxTotalDelayInSeconds
    );
    pageToken = response.nextPageToken;
    ret = ret.concat(transform(response));
  } while (pageToken !== undefined);
  return ret;
}
