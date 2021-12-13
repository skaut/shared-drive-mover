import "@testing-library/jest-dom";
import { mocked } from "ts-jest/utils";
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import ContinueButton from "../../src/frontend/ContinueButton.svelte";

import * as svelteI18n from "svelte-i18n";

jest.mock("svelte-i18n");

test("ContinueButton works", () => {
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
  mocked(svelteI18n._.subscribe).mockImplementationOnce(
    (run: (value: MessageFormatter) => void): (() => void) => {
      run((id: MessageObject | string): string => {
        return id as string;
      });
      return (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    }
  );

  const { component, getByText } = render(ContinueButton, {
    disabled: false,
  });
  const onNext = jest.fn();
  component.$on("next", onNext);
  expect(getByText("continue.buttonLabel")).toBeInTheDocument();
  expect(onNext.mock.calls.length).toBe(0);
  userEvent.click(getByText("continue.buttonLabel"));
  expect(onNext.mock.calls.length).toBe(1);
});
