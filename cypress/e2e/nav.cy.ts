describe("Navigation", ()=> {
    beforeEach(()=>{
        cy.visit("http://localhost:3000")
    })

    it("shows the hero heading", ()=>{
    cy.contains("William Wu").should("be.visible")
})

    it("opens AI search when clicking the sparkle icon", ()=>{
        cy.get('[aria-label="AI Search"]').click();
        cy.get("input").should("be.visible")
})
})
