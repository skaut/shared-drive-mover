import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import ContinueButton from "../../src/frontend/ContinueButton.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("ContinueButton works", () => {
  mockSvelteI18n();
  const { component } = render(ContinueButton, {
    disabled: false,
  });
  const onNext = jest.fn();
  component.$on("next", onNext);
  expect(screen.getByText("continue.buttonLabel")).toBeInTheDocument();
  expect(onNext.mock.calls).toHaveLength(0);
  userEvent.click(screen.getByText("continue.buttonLabel"));
  expect(onNext.mock.calls).toHaveLength(1);
});

test("ContinueButton gets disabled when the prop is passed", () => {
  mockSvelteI18n();
  render(ContinueButton, {
    disabled: true,
  });
  expect(screen.getByRole("button")).toBeDisabled();
});
