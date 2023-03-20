Feature: Add a promotion code 
    As a user I want to be able to apply promotion code
    So I can proceed to benefit from discounts


    @manual
    Scenario Outline: Enter valid promotional code for a booking  
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
		When the Route section and VISITORS options is populated
		When I select Date and Ticket on the modal
		Then the "Add Return" field is "active-green" in the Booking Page
		And the "Done" field has "navy-blue" background in the Booking Page
        And I enter a valid promotional code
        Then the 'Add' button becomes active
        When I click 'Add' button
        Then the promotional Code is applied
        And <BOOKING SUMMARY> contains the following information
        And 'Add a promotion code' text and text box is present
        Examples:
        |From   |To         |Ticket Type   |Date            |Vehicle Length      | Visitor |Ticket Price|Sub total|Total |promotion|
        |Elsinor|Helsingborg|Single Journey|10 February 2023|Car under 6 meter x1| Adult x1|€57.00      |€57.00   |€57.00|€17.00   |

    @manual
    Scenario Outline: Enter invalid promotional code for a booking  
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
		When the Route section and VISITORS options is populated
		When I select Date and Ticket on the modal
		Then the "Add Return" field is "active-green" in the Booking Page
		And the "Done" field has "navy-blue" background in the Booking Page
        And I enter an '<invalid>' promotional code
        Then the 'Add' button becomes active
        When I click 'Add' button
        Then the error displays, 'Invalid promo code'
        Examples:
        |Ticket Price|Sub total|Total |promotion|invalid|
        |€57.00      |€57.00   |€57.00|€17.00   |123456|