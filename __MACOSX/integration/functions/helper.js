export function getModalCaddy(){
    return cy.get('#portal').get('div[class*="modal_caddy_"]', { timeout: 15000 })
}

export function preventFailure(){
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
}



export function openFieldModal(button){
    let modalButton = cy.get('button[class^="button_button_"]', { timeout: 15000 }).contains(button)
    modalButton.should('be.visible');
    cy.wait(3000)
    modalButton.click({force: true})
}

export function selectVehicleType(vehicleType){
    openFieldModal("Travel")
    selectModalHorizontalOption("Vehicle")
    selectModalOption(vehicleType)
    clickModalButton("Done")
}

export function selectVisitorSection(){
    openFieldModal("Visitors")
    cy.get('#portal')
    .get("input[id='ticket[0]qty']")
    .parent('div[class*="fieldwrapper_layout_"]')
    .siblings('button').eq(1).click({force:true})
    clickModalButton("Done")
}

export async function getButtonByText(btnText){
    let modalButton = cy.get('button[class^="button_button_"]', { timeout: 15000 }).contains(btnText)
    cy.wait(3000)
    return modalButton
}

export function selectModalOption(selectedName){
    getModalCaddy()
    .get('div[class*="optionlist_row_"]')
    .get('span')
    .contains(selectedName)
    .click({force:true})
}

export function outBoundSelectDateTicket(){
    openFieldModal("Date")
    cy.get("#portal div[class*='datecell_available_']",{timeout:40000})
    .eq(0).click({ force: true })
    cy.get("#portal button span")
    .contains("Next")
    .click({ force: true })
    openFieldModal("Ticket")
    cy.get("#portal div[class*='datetile_list_'] div[class*='ticket_layout_'] p")
    .contains("Single Journey")
    .click({ force: true })
    cy.wait(5000)
    cy.get("div[id='portal'] div[class*='row_spread_'] button[class*='button_button_'] span")
    .contains("Done")
    .click({ force: true })
    cy.wait(5000)
}

export function clickModalButton(selectedName){
    if (selectedName == 'Done'){
        let button = getModalCaddy().find('button[class^="button_button_"]').contains(selectedName)
        button.click({force:true}) 
        return        
    }

    let button = getModalCaddy()
                .get('button')
                .get('span')
                .contains(selectedName)
    button.click({ force: true })
    
}
export function selectModalHorizontalOption(selectedName){
    getModalCaddy()
    .get('div[class*="optionlisthorizontal_row_"]')
    .get('span')
    .contains(selectedName)
    .click({ force: true })
}
export function checkModalDisplay(selectedName){
    
}
export function clickOutboundArrow(selectedName){
    
}

export function completeRouteSection(from,to){
    openFieldModal("From")
    selectModalOption(from)
    clickModalButton("Next")
    selectModalOption(to)
    clickModalButton("Done")
}


/**
 * Returns the color of a button with the given label text
 * @param {string} buttonText - The label text of the button
 * @returns {string} The CSS color of the button
 */
export function getButtonColor(buttonText,mode) {
    let baseColor;
    switch (mode) {
      case "orange":
        baseColor = "rgb(224, 80, 32)";
        break;
      case "greyed out":
        baseColor = "rgb(203, 203, 203)";
        break;
      case "active-green":
        baseColor = "rgb(112, 192, 160)";
        break;
      case "navy-blue":
        baseColor = "rgb(0, 32, 64)";
        break;
      default:
        baseColor = "rgb(203, 203, 203)";
    }
    return cy.get('button[class^="button_button_"]').contains(buttonText).should('have.css', 'color', baseColor);
  }
  
  /**
   * Returns the background color of a button with the given label text
   * @param {string} buttonText - The label text of the button
   * @returns {string} The CSS background color of the button
   */
  export function getButtonBackgroundColor(buttonText,mode) {
    let baseColor;
    switch (mode) {
      case "orange":
        baseColor = "rgb(224, 80, 32)";
        break;
      case "greyed out":
        baseColor = "rgb(203, 203, 203)";
        break;
      case "active-green":
        baseColor = "rgb(112, 192, 160)";
        break;
      case "navy-blue":
        baseColor = "rgb(0, 32, 64)";
        break;
      default:
        baseColor = "rgb(203, 203, 203)";
    }
    return cy.get('button[class^="button_button_"] span').contains(buttonText).closest("button").should('have.css', 'background-color', baseColor);
  }
  