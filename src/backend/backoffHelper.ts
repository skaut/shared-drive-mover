/* exported backoffHelper */

function backoffHelper( // TODO: async?
  request: () => GoogleAppsScript.Drive.Schema.FileList
): Promise<GoogleAppsScript.Drive.Schema.FileList> {
  return new Promise<GoogleAppsScript.Drive.Schema.FileList>(
    (resolve, reject) => {
      try {
        resolve(request()); // TODO: actual backoff
      } catch (e) {
        reject(e);
      }
    }
  );
}
