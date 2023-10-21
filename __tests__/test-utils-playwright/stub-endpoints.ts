import type { Page } from "@playwright/test";

/* eslint-disable @typescript-eslint/no-empty-function */

declare global {
  interface Window {
    _endpointStubs: Record<string, EndpointStub>;
  }
}

declare function _logEndpointCall(
  name: string,
  params: Array<google.script.Parameter>,
): void;

type Run = google.script.PublicEndpoints & google.script.RunnerFunctions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuccessHandlerType = (value?: any, object?: any) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FailureHandlerType = (error: Error, object?: any) => void;

type EndpointStub =
  | { status: "failure"; value: Error }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { status: "success"; value: any };

export const calls: Record<string, Array<Array<google.script.Parameter>>> = {};

export async function setup(page: Page): Promise<void> {
  await page.exposeFunction(
    "_logEndpointCall",
    (name: string, params: Array<google.script.Parameter>) => {
      if (!(name in calls)) {
        calls[name] = [];
      }
      calls[name].push(params);
    },
  );

  await page.evaluate(() => {
    window._endpointStubs = {} as Record<string, EndpointStub>;

    function endpointFn(
      successHandler: SuccessHandlerType,
      failureHandler: FailureHandlerType,
    ): Record<string, () => void> {
      const stubbedEndpoints: Record<string, () => void> = {};
      for (const key in window._endpointStubs) {
        const stub = window._endpointStubs[key];
        if (stub.status === "success") {
          stubbedEndpoints[key] = (
            ...args: Array<google.script.Parameter>
          ): void => {
            _logEndpointCall(key, args);
            successHandler(stub.value);
          };
        } else {
          stubbedEndpoints[key] = (
            ...args: Array<google.script.Parameter>
          ): void => {
            _logEndpointCall(key, args);
            failureHandler(stub.value);
          };
        }
      }
      return stubbedEndpoints;
    }

    const run: google.script.RunnerFunctions = {
      withFailureHandler: (failureHandler: FailureHandlerType): Run =>
        ({
          withSuccessHandler: (
            successHandler: SuccessHandlerType,
          ): Record<string, () => void> =>
            endpointFn(successHandler, failureHandler),
        }) as Run,
      withSuccessHandler: (successHandler: SuccessHandlerType): Run =>
        ({
          withFailureHandler: (
            failureHandler: FailureHandlerType,
          ): Record<string, () => void> =>
            endpointFn(successHandler, failureHandler),
        }) as Run,
      withUserObject: (): Run => ({}) as Run,
    };

    window.google = {
      script: {
        history: {
          push: (): void => {},
          replace: (): void => {},
          setChangeHandler: (): void => {},
        },
        host: {
          close: (): void => {},
          setHeight: (): void => {},
          setWidth: (): void => {},
          origin: "",
          editor: {
            focus: (): void => {},
          },
        },
        run: run as Run,
        url: {
          getLocation: (): void => {},
        },
      },
    };
  });
}