
import {
    Given,
    And,
    Then,
    When
  } from "cypress-cucumber-preprocessor/steps";
  import * as helper from "../../../functions/helper";

And("The timer exceed allocated time",() => {
    // speed up time by 19 minutes and 59 seconds
    cy.clock();
    const now = new Date();
    const fastForwardTime = now.getTime() + (1199000-120); // 19 minutes and 59 seconds in milliseconds
    cy.clock(fastForwardTime);
    cy.wait(50000)
});

