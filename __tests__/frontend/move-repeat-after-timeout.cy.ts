import { stubEndpoints } from "../test-utils/stubEndpoints";

let attempt = 0;

const stubs = stubEndpoints({
  listFolders: (successHandler) => {
    successHandler({ status: "success", response: [] });
  },
  listSharedDrives: (successHandler) => {
    successHandler({ status: "success", response: [] });
  },
  move: (successHandler, failureHandler) => {
    setTimeout(() => {
      if (attempt < 2) {
        const e = new Error();
        e.name = "ScriptError";
        failureHandler(e);
      } else {
        successHandler({ status: "success", response: { errors: [] } });
      }
      attempt += 1;
    }, 300);
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
  cy.contains("is moving");
  cy.contains("Done!");
  cy.contains("Successfully moved").then(() => {
    expect(stubs.move).to.have.been.calledOnceWith(
      "root",
      "root",
      true,
      true,
      false
    );
  });
});
