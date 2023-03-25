Feature: Book your journey
	As a User I will like to book a journey

	@automated
	Scenario: Validate 'From' button on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		Then the "From" field is "orange" in the Booking Page
		And the "To" field is "greyed out" in the Booking Page
		And the "Travel" field is "greyed out" in the Booking Page
		And the "Visitors" field is "greyed out" in the Booking Page
		And the "Date" field is "greyed out" in the Booking Page
		And the "Ticket" field is "greyed out" in the Booking Page
		And the "Add Return" field is "greyed out" in the Booking Page
		And the "Done" field is "greyed out" in the Booking Page
		And The 'Basket is empty' should be displayed in BOOKING SUMMARY
		And The 'Book your journey' heading is displayed on the top left hand side

	@automated
	Scenario: Validate 'How' section on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        Then the "Travel" field is "orange" in the Booking Page
        Then the "Visitors" field is "orange" in the Booking Page
		And the "Date" field is "greyed out" in the Booking Page
		And the "Ticket" field is "greyed out" in the Booking Page
		And the "Add Return" field is "greyed out" in the Booking Page
		And the "Done" field is "greyed out" in the Booking Page
		And The 'Basket is empty' should be displayed in BOOKING SUMMARY
		And The 'Book your journey' heading is displayed on the top left hand side

	@automated
	Scenario: Validate 'Travel' section on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
		Then the "Visitors" field is "orange" in the Booking Page
		And the "Date" field is "greyed out" in the Booking Page
		And the "Ticket" field is "greyed out" in the Booking Page
		And the "Add Return" field is "greyed out" in the Booking Page
		And the "Done" field is "greyed out" in the Booking Page
		And The 'Basket is empty' should be displayed in BOOKING SUMMARY
		And The 'Book your journey' heading is displayed on the top left hand side

	@automated
	Scenario: Validate 'Visitors' section on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
		When the Route section and VISITORS options is populated
		Then the "Date" field is "orange" in the Booking Page
		And the "Ticket" field is "greyed out" in the Booking Page
		And the "Add Return" field is "greyed out" in the Booking Page
		And the "Done" field is "greyed out" in the Booking Page
		And The 'Basket is empty' should be displayed in BOOKING SUMMARY
		And The 'Book your journey' heading is displayed on the top left hand side

	@automated
	Scenario: Validate 'Date' and 'Ticket' section on Home Screen
		Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
		When the Route section and VISITORS options is populated
		When I select Date and Ticket on the modal
		Then the "Add Return" field is "active-green" in the Booking Page
		And the "Done" field has "navy-blue" background in the Booking Page
		And The 'Basket is empty' should not be displayed in BOOKING SUMMARY
		And The 'Book your journey' heading is displayed on the top left hand side
