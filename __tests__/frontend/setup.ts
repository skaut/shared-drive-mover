import { mocked } from "jest-mock";

import * as svelteI18n from "svelte-i18n";

jest.mock("svelte-i18n");

beforeEach(() => {
  type FormatXMLElementFn<T, R = Array<T | string> | T | string> = (
    parts: Array<T | string>
  ) => R;
  type InterpolationValues =
    | Record<
        string,
        | Date
        | FormatXMLElementFn<unknown>
        | boolean
        | number
        | string
        | null
        | undefined
      >
    | undefined;
  interface MessageObject {
    id: string;
    locale?: string;
    format?: string;
    default?: string;
    values?: InterpolationValues;
  }
  type MessageFormatter = (id: MessageObject | string) => string;
  mocked(svelteI18n._.subscribe).mockImplementation(
    (run: (value: MessageFormatter) => void): (() => void) => {
      run((id: MessageObject | string): string => {
        return id as string;
      });
      return (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    }
  );
});
