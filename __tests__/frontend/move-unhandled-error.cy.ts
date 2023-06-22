import { stubEndpoints } from "../test-utils/stubEndpoints";

stubEndpoints({
  listFolders: (successHandler) => {
    successHandler({ status: "success", response: [] });
  },
  listSharedDrives: (successHandler) => {
    successHandler({ status: "success", response: [] });
  },
  move: (_, failureHandler) => {
    setTimeout(() => {
      failureHandler(new Error("ERROR MESSAGE"));
    }, 100);
  },
});

it("works with an unhandled move error", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains('contents of the folder "My Drive" into the folder "My Drive"');
  cy.contains("Move").click();
  cy.contains("Confirmation");
  cy.contains("An error occurred").should("be.visible");
  cy.contains("ERROR MESSAGE");
});
