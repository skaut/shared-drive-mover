import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import Moving from "../../src/frontend/Moving.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("Moving works", () => {
  mockSvelteI18n();
  const { component } = render(Moving);
  const onCancel = jest.fn();
  const onConfirm = jest.fn();
  component.$on("nonEmptyDialogCancel", onCancel);
  component.$on("nonEmptyDialogConfirm", onConfirm);
  expect(screen.getByText("steps.moving.introduction")).toBeInTheDocument();
  expect(onCancel.mock.calls).toHaveLength(0);
  expect(onConfirm.mock.calls).toHaveLength(0);
  (component.showNonEmptyDialog as () => void)();
  userEvent.click(screen.getByText("steps.moving.nonEmptyDialog.cancel"));
  expect(onCancel.mock.calls).toHaveLength(1);
  expect(onConfirm.mock.calls).toHaveLength(0);
  userEvent.click(screen.getByText("steps.moving.nonEmptyDialog.confirm"));
  expect(onCancel.mock.calls).toHaveLength(1);
  expect(onConfirm.mock.calls).toHaveLength(1);
});
