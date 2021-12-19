import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import BackButton from "../../src/frontend/BackButton.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("BackButton works", () => {
  mockSvelteI18n();
  const { component } = render(BackButton);
  const onPrevious = jest.fn();
  component.$on("previous", onPrevious);
  expect(screen.getByText("back.buttonLabel")).toBeInTheDocument();
  expect(onPrevious.mock.calls).toHaveLength(0);
  userEvent.click(screen.getByText("back.buttonLabel"));
  expect(onPrevious.mock.calls).toHaveLength(1);
});
