import { stubEndpoints } from "../test-utils/stubEndpoints";

stubEndpoints({
  listSharedDrives: (_, failureHandler) => {
    setTimeout(() => {
      failureHandler(new Error("ERROR MESSAGE"));
    }, 100);
  },
});

it("handles raw errors in source folder selection gracefully", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("An error occurred").should("be.visible");
  cy.contains("ERROR MESSAGE");
});
