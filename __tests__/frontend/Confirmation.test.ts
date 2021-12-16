import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
//import userEvent from "@testing-library/user-event";

import Confirmation from "../../src/frontend/Confirmation.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("Confirmation works", () => {
  const svelteI18nRunFn = mockSvelteI18n();
  const { component, getByText } = render(Confirmation, {
    source: null,
    destination: null,
  });
  const onPrevious = jest.fn();
  const onNext = jest.fn();
  component.$on("previous", onPrevious);
  component.$on("next", onNext);
  expect(getByText("steps.confirmation.introduction")).toBeInTheDocument();
  expect(getByText("steps.confirmation.buttonLabel")).toBeInTheDocument();
  expect(onPrevious.mock.calls).toHaveLength(0);
  expect(onNext.mock.calls).toHaveLength(0);
  //userEvent.click(getByText("continue.buttonLabel"));
  //expect(onNext.mock.calls).toHaveLength(1);
});
