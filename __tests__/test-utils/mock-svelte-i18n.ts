import { mocked } from "jest-mock";

import { _ } from "svelte-i18n";

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
type MessageFormatter = (
  id: MessageObject | string,
  options?: Omit<MessageObject, "id">
) => string;

export function mockSvelteI18n(): jest.Mock<
  string,
  [id: MessageObject | string, options?: Omit<MessageObject, "id">]
> {
  const svelteI18nRunFn = jest
    .fn<
      string,
      [id: MessageObject | string, options?: Omit<MessageObject, "id">]
    >()
    .mockImplementation((id) => (typeof id === "string" ? id : id.id));
  mocked(_.subscribe).mockImplementation(
    (run: (value: MessageFormatter) => void): (() => void) => {
      run(svelteI18nRunFn);
      return (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    }
  );
  return svelteI18nRunFn;
}
