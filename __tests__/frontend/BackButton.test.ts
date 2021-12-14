import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import BackButton from "../../src/frontend/BackButton.svelte";

test("BackButton works", () => {
  const { component, getByText } = render(BackButton);
  const onPrevious = jest.fn();
  component.$on("previous", onPrevious);
  expect(getByText("back.buttonLabel")).toBeInTheDocument();
  expect(onPrevious.mock.calls.length).toBe(0);
  userEvent.click(getByText("back.buttonLabel"));
  expect(onPrevious.mock.calls.length).toBe(1);
});
