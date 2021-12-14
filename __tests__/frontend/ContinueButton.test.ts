import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import ContinueButton from "../../src/frontend/ContinueButton.svelte";

test("ContinueButton works", () => {
  const { component, getByText } = render(ContinueButton, {
    disabled: false,
  });
  const onNext = jest.fn();
  component.$on("next", onNext);
  expect(getByText("continue.buttonLabel")).toBeInTheDocument();
  expect(onNext.mock.calls).toHaveLength(0);
  userEvent.click(getByText("continue.buttonLabel"));
  expect(onNext.mock.calls).toHaveLength(1);
});

test("ContinueButton gets disabled when the prop is passed", () => {
  const { getByText } = render(ContinueButton, {
    disabled: true,
  });
  expect(getByText("continue.buttonLabel").parentElement).toBeDisabled();
});
