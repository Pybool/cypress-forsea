import {
    Given,
    And,
    Then,
    When
  } from "cypress-cucumber-preprocessor/steps";
  import {
    openFieldModal,
    selectModalOption,
    clickModalButton,
    selectModalHorizontalOption
  } from "../../../functions/helper";
  
  const buttonsSelector = 'button[class^="button_button_"]';
  const returnDateSelector = 'h3:contains(Return Date)';
  const modalDoneButtonSelector = `${buttonsSelector}:contains(Done)`;
  const addReturnButtonSelector = `${buttonsSelector}:contains(Add Return)`;
  const viewLayoutSelector = 'div[class^="view_layout_"]';
  
  And("the 'Add Return' button is highlighted", () => {
    cy.get(addReturnButtonSelector, { timeout: 15000 })
      .should('be.visible')
      .should("have.text", 'Add Return')
      .closest("button")
      .should("have.css", "background-color", "rgb(13, 112, 120)")
  });
  
  And("the 'DONE' button is highlighted and clickable", () => {
    cy.get(modalDoneButtonSelector, { timeout: 15000 })
      .should('be.visible')
      .should("have.text", 'Done')
      .closest("button")
      .should("have.css", "background-color", "rgb(0, 32, 64)")
      .should("not.have", "attr", "disabled")
  });
  
  And("the 'Add Return' button is clicked", () => {
    cy.get(addReturnButtonSelector, { timeout: 15000 })
      .closest("button")
      .click({
        force: true
      })
  });
  
  And("the 'Return Date' modal is displayed", () => {
    cy.get(returnDateSelector, { timeout: 15000 })
      .next()
      .should("be.visible")
  });
  
  And("'Items reserved in cart for x:xx minutes' dispalyed", () => {
    cy.get(modalDoneButtonSelector, {
        timeout: 15000
      })
      .click({
        force: true
      });
    cy.get(viewLayoutSelector, {
        timeout: 25000
      })
      .should("be.visible")
      .within(() => {
        cy.get('p')
          .invoke("text")
          .then((txt) => {
            expect(txt.includes('Items reserved in cart for')).to.be.true
          })
      })
      .then(() => {
        cy.wait(5000)
          .then(() => {
            cy.go(-1)
          })
      })
  });
  
  And("the Modal shows Days of the week", () => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const selector = cy.get(returnDateSelector, { timeout: 15000 })
      .next()
      .find("div")
      .contains("Mon")
      .siblings();
  
    selector.each((span) => {
      cy.wrap(span).invoke("text").then((txt) => {
        expect(weekdays.includes(txt)).to.be.true
      })
    })
  });
  
  When("I click the front arrow icon", () => {
    const selector = cy.get(returnDateSelector, { timeout: 15000 })
      .next()
      .find('button');
  
    selector.eq(1).click();
  });
  
  When("I click the back arrow icon", () => {
    const selector = cy.get(returnDateSelector, { timeout: 15000 })
      .next()
      .find('button');
  
    selector.eq(0).click();
  });

Then("next 7 days options displays", ()=>{
    const monthDays = {'Jan': 31, 'Feb': 28, 'Mar': 31, 'Apr': 30, 'May': 31, 'Jun': 30, 
                       'Jul': 31, 'Aug': 31, 'Sep': 30, 'Oct': 31, 'Nov': 30, 'Dec': 31};
    let month;
    let selector = cy.get('div.datecell_ghosted', { timeout: 15000 }).find("span").first()
    selector.invoke('text').then((txt)=>{
        let dateStr = parseInt(txt)

        if ((dateStr+ 1) > monthDays[month]){
            let diff = (dateStr + 7) - monthDays[month]
        }
    })
    
})

