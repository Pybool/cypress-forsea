
Feature: Booking page
	As a User I will like to book a journey
	@automated
	Scenario: C2375 Validate From button on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		Then the "From" field is "orange" in the Booking Page
		And the "To" field is "greyed out" in the Booking Page
		And the "Travel" field is "greyed out" in the Booking Page
		And the "Visitors" field is "greyed out" in the Booking Page

	@automated
	Scenario: Validate <YOUR DETAILS> link on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		And the 'Your Details' should be inactive and maintains green CSS
		And The 'Basket is empty' should be displayed in BOOKING SUMMARY
		And The 'Book your journey' heading is displayed on the top left hand side

	@automated
	Scenario: Validate <MAKE PAYMENT> link on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		Then the 'Make Payment' should be inactive and maintains green CSS
		And The 'Basket is empty' should be displayed in BOOKING SUMMARY
		And The 'Book your journey' heading is displayed on the top left hand side


	@automated
	Scenario: Validate FROM and TO fields

		Given I am a user of ForSea
		When I visit the Booking page
		Then the "From" field is "orange" in the Booking Page
		And the "To" field is "greyed out" in the Booking Page
		When I click the "From" field in the Booking Page
		Then I should see "From" modal in Booking Page
		Then I select "Sweden, Helsingborg" from the list
		Then I click "Next" button from the modal
		Then I should see "To" modal in Booking Page
		Then I select "Denmark, Elsinor" from the list
		Then I click "Done" button from the modal
		Then the "From" field is "active-green" in the Booking Page
		And the "To" field is "active-green" in the Booking Page
		


	@automated
	Scenario: Validate Travel and Visitors field on the Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
		Then the "Travel" field is "orange" in the Booking Page
		Then the "Visitors" field is "orange" in the Booking Page
		Then the "From" field is "active-green" in the Booking Page
		Then the "To" field is "active-green" in the Booking Page
		Then the "Date" field is "greyed out" in the Booking Page
		Then the "Ticket" field is "greyed out" in the Booking Page
		Then the "Add Return" field is "greyed out" in the Booking Page
		Then the "Date" field is "greyed out" in the Booking Page

	@automated
	Scenario Outline: Validate Travel and Visitors field for vehicle
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
		When I click the "Travel" field in the Booking Page
		Then I select "Vehicle" from the box list
		Then I select "<vehicle_length>" from the list

		Examples:

			| vehicle_length     |
			| Car under 6 meter  |
			| Motorhome < 6 meter |
			| Motorhome > 6 meter |
			| Car + motorhome |
			| Car + trailer |
			| Motorcycle |


	@automated
	Scenario: Validate Arrow button on the booking page
		Given I am a user of ForSea
		When I visit the Booking page
		When user click the back arrow button on booking page
		Then I should be on the 'Make a Booking Page' and '/explore' url should match