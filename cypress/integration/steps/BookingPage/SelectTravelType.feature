Feature: Select Travel types
    As a user I want to select travel type
    So I have the right ticket

    @automated
    Scenario Outline: User selects vehicle type
        Given I am a user of ForSea
		When I visit the Booking page
		When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
		When I click the "Travel" field in the Booking Page
		Then I select "Vehicle" from the box list
		Then I select "<vehicle_length>" from the list
        Then I click "Done" button from the modal
        And The 'Book your journey' heading is displayed on the top left hand side
        Examples:
            | vehicle_length     |
			| Car under 6 meter  |
			| Motorhome < 6 meter |
			| Motorhome > 6 meter |
			| Car + motorhome |
			| Car + trailer |
			| Motorcycle |