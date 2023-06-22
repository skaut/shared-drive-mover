import { stubEndpoints } from "../test-utils/stubEndpoints";

stubEndpoints({
  listSharedDrives: (successHandler) => {
    setTimeout(() => {
      successHandler({ status: "error", type: "unknown" });
    }, 100);
  },
});

it("handles raw errors in source folder selection gracefully", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("An error occurred").should("be.visible");
  cy.contains("An unknown error occurred").should("be.visible");
});
