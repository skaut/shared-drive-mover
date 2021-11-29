export async function backoffHelper<T>(request: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      backoff(
        () => {
          resolve(request());
        },
        1,
        1
      );
    } catch (e) {
      reject(e);
    }
  });
}

declare function setTimeout(fn: () => void, timeout: number): void;

function backoff(fn: () => void, tries: number, previousDelay: number): void {
  try {
    fn();
  } catch (e) {
    // TODO: Check the error
    // Maximum of 64 seconds *total* delay
    if (tries < 6) {
      const jitter = Math.random() - 0.5;
      const delay =
        tries > 1 ? previousDelay * (2 + jitter) : 1 + Math.abs(jitter);
      setTimeout(() => {
        backoff(fn, tries + 1, delay);
      }, delay * 1000);
    } else {
      throw e;
    }
  }
}
