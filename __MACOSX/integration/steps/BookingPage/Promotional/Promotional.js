
import { Given, And, Then, When } from "cypress-cucumber-preprocessor/steps";
import * as helper from "../../../functions/helper";



When("the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field", () => {
    const from = 'Sweden, Helsingborg';
    const to = 'Denmark, Elsinor';
    helper.completeRouteSection(from, to);
})

Then("I select 'Car under 6 meter' from the vehicle modal", () => {
    const vehicleType = 'Car under 6 meter';
    helper.selectVehicleType(vehicleType);
    helper.selectVisitorSection();
   
})

And("I enter an 123456 as promotional code", () => {
    cy.get("input[class*='input_input_']").type(123456)
})

Then("the 'Add' button becomes active", () => {
    cy.get("button[class='button_button_musmy']").should("not.have", "attr", "disabled")
})

When("I click 'Add' button", () => {
    cy.get("button[class='button_button_musmy']").click()
})


Then("the error displays, 'Invalid promo code'", () => {
    cy.get("div[class*='toaster_toast']").find('span').contains('Invalid promo code').should("exist").and("be.visible")
})










Then("the 'Add' button becomes active", () => {
    
   
})

When("I click 'Add' button", () => {
    
   
})

Then('the error displays, {string}', (errorMessage) => {
    
   
})