describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    // Not working due to Keycloak login redirect
    // cy.contains('Copernicus');
    // cy.contains('User Web Client');
  });
});
