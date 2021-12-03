import "@testing-library/jest-dom";
import { mocked } from "ts-jest/utils";
import { render } from "@testing-library/svelte";

import ContinueButton from "../../src/frontend/ContinueButton.svelte";

import * as svelteI18n from "svelte-i18n";

jest.mock("svelte-i18n");

test("TEST", () => {
  type FormatXMLElementFn<T, R = Array<T | string> | T | string> = (
    parts: Array<T | string>
  ) => R;
  type InterpolationValues =
    | Record<
        string,
        boolean | Date | FormatXMLElementFn<unknown> | null | number | string | undefined
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
  mocked(svelteI18n._.subscribe).mockImplementationOnce(
    (run: (value: MessageFormatter) => void): (() => void) => {
      run((id: MessageObject | string): string => {
        return id as string;
      });
      return (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    }
  );
  const { getByText } = render(ContinueButton, { disabled: false });
  expect(getByText("continue.buttonLabel")).toBeInTheDocument();
});
