/* exported paginationHelper */

function paginationHelper(
  request: (pageToken: string | null) => GoogleAppsScript.Drive.Schema.FileList,
  transform: (
    response: GoogleAppsScript.Drive.Schema.FileList
  ) => Array<NamedRecord>
): Array<NamedRecord> {
  let ret: Array<NamedRecord> = [];
  let pageToken = null;
  do {
    const response = request(pageToken);
    pageToken = response.nextPageToken;
    ret = ret.concat(transform(response));
  } while (pageToken !== undefined);
  return ret;
}
