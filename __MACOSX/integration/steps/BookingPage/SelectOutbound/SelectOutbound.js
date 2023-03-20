import { Given, And, Then, When } from "cypress-cucumber-preprocessor/steps";
import { openFieldModal ,
    checkModalDisplay,
    clickOutboundArrow
} from "../../../functions/helper";

When("I select Date in the outbound section", () => {
    openFieldModal("Date")
})
Then("the 'Outbound Date' modal displays", () => {
    checkModalDisplay('Outbound Date')
})
Then("the 'Outbound Date' modal defaults to the current month", () => {
   
})
Then("the 'NEXT' button in the 'Outbound Date' modal is greyed out", () => {
    
})
When("I click the forward arrow icon", () => {
    clickOutboundArrow("forward")
})
Then("the next month options displays", () => {
    
})      
Then("the previous month option displays", () => {
    
}) 
When("I click the back arrow icon", () => {
    clickOutboundArrow("back")
}) 
When("I click the 'X' icon", () => {
    clickOutboundArrow("closeIcon")
})  
Then("Outbound Date modal closes", () => {
    
}) 
Then("the 'Book your journey' page displays", () => {
    cy
        .get('div[class*="row_spread_"]')
        .get('div')
        .get('h1')
        .contains("Book your journey")
}) 
Then("the 'Outbound Date' modal shows 7 days of the week in a table", () => {
    
}) 
Then("the 'Outbound Date' modal displays prices in the default currency for the market", () => {
    
}) 
When("I select a greyed out date", () => {
    
})  
Then("the date is not clickable", () => {
    
}) 
When("I select Date and Ticket on the modal", () => {
    
    cy.get("#portal div[class*='datecell_available_']",{timeout:40000})
    .eq(0).click({ force: true })
    cy.get("#portal button span")
    .contains("Next")
    .click({ force: true })
    cy.get("#portal div[class*='datetile_list_'] div[class*='ticket_layout_'] p")
    .contains("Single Journey")
    .click({ force: true })
    cy.wait(5000)
    cy.get("div[id='portal'] div[class*='row_spread_'] button[class*='button_button_'] span")
    .contains("Done")
    .click({ force: true })
    cy.wait(5000)
      
}) 
When("I click the back arrow icon on outbound ticket", () => {
    
})  
Then("the 'Outbound Ticket' modal Ticket", () => {
    checkModalDisplay('Outbound Date')
})  
Then("'Today', 'Tomorrow', 'A day After' date options displays", () => {
    
})  
Then("ticket options displays", () => {
    cy
    .get('div[class*="row_spread_"]')
    .get('div')
    .get('h1')
    .contains("Book your journey")
})  
Then("previous 5 days options displays", () => {
    
}) 
Then("next 5 days options displays", () => {
    
}) 
When("I click the front arrow icon on the outbound ticket", () => {
    
}) 

When("I select an active date", () => {
    cy.get("#portal div[class*='datecell_available_']",{timeout:40000})
    .eq(0).click({ force: true })
}) 

When("the 'NEXT' button in the 'Outbound Date' is clicked", () => {
    cy.get("#portal button span")
    .contains("Next")
    .click({ force: true })
}) 
Then("the date is highlighted in green", () => {
    
}) 
Then("the 'NEXT' button in the 'Outbound Date' modal is active", () => {
    cy.get("#portal button span")
    .contains("Next")
}) 

When("I select Single Journey in the 'Outbound Ticket' modal", () => {
    cy.get("#portal div[class*='datetile_list_'] div[class*='ticket_layout_'] p")
    .contains("Single Journey")
    .click({ force: true })
}) 
When("I click 'DONE' button in the outbound Ticket", () => {
    cy.wait(5000)
    cy.get("div[id='portal'] div[class*='row_spread_'] button[class*='button_button_'] span")
    .contains("Done")
    .click({ force: true })
    cy.wait(5000)
}) 
Then("the date is highlighted in green in the outbound Ticket", () => {
    
}) 


