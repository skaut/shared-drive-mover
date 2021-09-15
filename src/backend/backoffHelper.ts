/* exported backoffHelper */

function backoffHelper<T extends { nextPageToken?: string | undefined }>(
  request: () => T,
  maxTotalDelayInSeconds: number
): Promise<T> {
  const maxTries = Math.floor(Math.log2(maxTotalDelayInSeconds));
  return new Promise<T>((resolve, reject) => {
    try {
      backoff(() => resolve(request()), maxTries, 1, 1);
    } catch (e) {
      reject(e);
    }
  });
}

declare function setTimeout(fn: () => void, timeout: number): void;

function backoff(
  fn: () => void,
  maxTries: number,
  tries: number,
  previousDelay: number
): void {
  try {
    fn();
  } catch (e) {
    // TODO: Check the error
    if (tries < maxTries) {
      const jitter = Math.random() - 0.5;
      const delay =
        tries > 1 ? previousDelay * (2 + jitter) : 1 + Math.abs(jitter);
      setTimeout(() => backoff(fn, maxTries, tries + 1, delay), delay * 1000);
    } else {
      throw e;
    }
  }
}
