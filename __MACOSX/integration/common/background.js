import {
    Given,
    And,
    Then,
    When
  } from "cypress-cucumber-preprocessor/steps";
  import * as helper from "../functions/helper";
  
  Given('I am a user of ForSea', () => {
  
  });
  
  When('I visit the Booking page', () => {
    cy.visit('/ticket/route');
  });
  
  When("I am on Book your journey page", () => {
    cy.visit('/book');
  });
  
  And("'Route' section is completed", () => {
    const from = 'Sweden, Helsingborg';
    const to = 'Denmark, Elsinor';
    helper.completeRouteSection(from, to);
  });
  
  And("'How' section is completed", () => {
    const vehicleType = 'Car under 6 meter';
    helper.selectVehicleType(vehicleType);
    helper.selectVisitorSection();
  });
  
  And("'OutBound' section is completed", () => {
    helper.outBoundSelectDateTicket();
  });
  
  When('I should be on the {string} and {string} url should match', (name, url) => {
    cy.url().should('eq', Cypress.config().baseUrl + "/explore");
  });
  
  When('the {string} and {string} fields are populated on the To and From field', (from, to) => {
    helper.completeRouteSection(from, to);
  });
  
  When('I select {string} from the vehicle modal', (vehicleType) => {
    helper.selectVehicleType(vehicleType);
  });
  
  When('I select Date and Ticket on the modal', () => { 
    helper.preventFailure();
    helper.openFieldModal("Date");
    cy.get("#portal div[class*='datecell_available_']", {
      timeout: 40000
    }).eq(0).click({
      force: true
    });
    cy.get("#portal button span").contains("Next").click({
      force: true
    });
    cy.get("#portal div[class*='datetile_list_'] div[class*='ticket_layout_'] p").contains("Single Journey").click({
      force: true
    });
    cy.wait(5000);
    helper.clickModalButton("Done");
    cy.wait(5000);
  });
  
  When('the Route section and VISITORS options is populated', () => {
    helper.openFieldModal("Visitors");
    cy.get('#portal').get("input[id='ticket[0]qty']").parent('div[class*="fieldwrapper_layout_"]').siblings('button').eq(1).click();
    helper.clickModalButton("Done");
  });
  
  Then('the {string} field is {string} in the Booking Page', (button, mode) => {
    helper.getButtonColor(button,mode);
   
  });
  
  Then('the {string} field has {string} background in the Booking Page', (button, mode) => {
    helper.getButtonBackgroundColor(button,mode);
  });
  