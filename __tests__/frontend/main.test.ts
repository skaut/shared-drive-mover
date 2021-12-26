Cypress.on("window:before:load", (win) => {
  function endpoints(
    successHandler: (
      first?: google.script.Parameter | HTMLFormElement,
      ...rest: Array<google.script.Parameter>
    ) => void
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
        withFailureHandler: cy.stub().returns({
          withSuccessHandler: cy
            .stub()
            .callsFake((successHandler: () => void) =>
              endpoints(successHandler)
            ),
        }),
        withSuccessHandler: cy
          .stub()
          .callsFake((successHandler: () => void) => {
            return {
              withFailureHandler: cy.stub().returns(endpoints(successHandler)),
            };
          }),
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
