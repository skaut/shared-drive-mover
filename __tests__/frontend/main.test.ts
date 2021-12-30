Cypress.on("window:before:load", (win) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type successHandlerType = (value?: any, object?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type failureHandlerType = (error: Error, object?: any) => void;
  function endpoints(
    successHandler: successHandlerType,
    failureHandler: failureHandlerType
  ): object {
    return {
      listSharedDrives: cy.stub().callsFake(() => {
        successHandler([]);
      }),
    };
  }
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
          .callsFake((failureHandler: failureHandlerType) => ({
            withSuccessHandler: cy
              .stub()
              .callsFake((successHandler: successHandlerType) =>
                endpoints(successHandler, failureHandler)
              ),
          })),
        withSuccessHandler: cy
          .stub()
          .callsFake((successHandler: successHandlerType) => ({
            withFailureHandler: cy
              .stub()
              .callsFake((failureHandler: failureHandlerType) =>
                endpoints(successHandler, failureHandler)
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

it("TEST-E2E", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
});
