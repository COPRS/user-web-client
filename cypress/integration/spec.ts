describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Copernicus');
    cy.contains('User Web Client');
  });
});
