/* exported paginationHelper */

async function paginationHelper(
  request: (
    pageToken: string | null | undefined
  ) => GoogleAppsScript.Drive.Schema.FileList,
  transform: (
    response: GoogleAppsScript.Drive.Schema.FileList
  ) => Array<NamedRecord>
): Promise<Array<NamedRecord>> {
  let ret: Array<NamedRecord> = [];
  let pageToken: string | null | undefined = null;
  do {
    const response = await backoffHelper(() => request(pageToken));
    pageToken = response.nextPageToken;
    ret = ret.concat(transform(response));
  } while (pageToken !== undefined);
  return ret;
}
