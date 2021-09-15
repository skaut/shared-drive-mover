/* exported listSharedDrives */

async function listSharedDrives(): Promise<Array<NamedRecord>> {
  return await paginationHelper<
    GoogleAppsScript.Drive.Schema.DriveList,
    NamedRecord
  >(
    (pageToken) =>
      Drive.Drives!.list({
        pageToken: pageToken,
        maxResults: 100,
        fields: "nextPageToken, items(id, name)",
      }),
    (response) =>
      response.items!.map((item) => ({ id: item.id!, name: item.name! }))
  );
}
