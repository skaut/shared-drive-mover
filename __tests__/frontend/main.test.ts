// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuccessHandlerType = (value?: any, object?: any) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FailureHandlerType = (error: Error, object?: any) => void;

function stubEndpoints(
  endpoints: Record<
    string,
    (
      successHandler: SuccessHandlerType,
      failureHandler: FailureHandlerType,
      parameters: Array<google.script.Parameter>
    ) => void
  >
): Record<string, sinon.SinonStub> {
  const stubbedEndpoints: Record<string, sinon.SinonStub> = {};
  function endpointFn(
    successHandler: SuccessHandlerType,
    failureHandler: FailureHandlerType
  ): Record<string, sinon.SinonStub> {
    for (const key in endpoints) {
      stubbedEndpoints[key] = cy.stub().callsFake((...args) => {
        endpoints[key](successHandler, failureHandler, args);
      });
    }
    return stubbedEndpoints;
  }
  Cypress.on("window:before:load", (win) => {
    win.google = {
      script: {
        history: {
          push: cy.stub(),
          replace: cy.stub(),
          setChangeHandler: cy.stub(),
        },
        host: {
          close: cy.stub(),
          setHeight: cy.stub(),
          setWidth: cy.stub(),
          origin: "",
          editor: {
            focus: cy.stub(),
          },
        },
        run: {
          withFailureHandler: cy
            .stub()
            .callsFake((failureHandler: FailureHandlerType) => ({
              withSuccessHandler: cy
                .stub()
                .callsFake((successHandler: SuccessHandlerType) =>
                  endpointFn(successHandler, failureHandler)
                ),
            })),
          withSuccessHandler: cy
            .stub()
            .callsFake((successHandler: SuccessHandlerType) => ({
              withFailureHandler: cy
                .stub()
                .callsFake((failureHandler: FailureHandlerType) =>
                  endpointFn(successHandler, failureHandler)
                ),
            })),
          withUserObject: cy.stub(),
        },
        url: {
          getLocation: cy.stub(),
        },
      },
    };
  });
  return stubbedEndpoints;
}

stubEndpoints({
  listFolders: (successHandler) => {
    successHandler([]);
  },
  listSharedDrives: (successHandler) => {
    successHandler([]);
  },
  move: (successHandler) => {
    setTimeout(() => {
      successHandler({ status: "success", errors: [] });
    }, 100);
  },
});

it("TEST-E2E", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains("Move").click();
  cy.contains("is moving");
  cy.contains("Done!");
  cy.contains("Successfully moved");
});
