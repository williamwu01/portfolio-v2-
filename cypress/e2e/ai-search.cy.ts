describe("AI Search", () => {
beforeEach(() => {
    cy.visit("http://localhost:3000");
});

it("shows the AI response after searching", () => {
    cy.intercept("POST", "/api/search", "This is a mocked AI response.").as("search");

    cy.get('[aria-label="AI Search"]').click();
    cy.get("input").type("What projects has William built?{enter}");

    cy.wait("@search");
    cy.contains("This is a mocked AI response.").should("be.visible");
});
});