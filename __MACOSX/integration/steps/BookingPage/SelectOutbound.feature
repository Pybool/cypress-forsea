Feature: Select Dates for OutBound
    As a user I want to select outbound Date
    So I can proceed to return dates

    @automated
    Scenario: Next button in the Outbound Date Modal greyed out
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        And the 'Outbound Date' modal defaults to the current month
        And the 'NEXT' button in the 'Outbound Date' modal is greyed out

    @automated
    Scenario: Forward Arrow icon in Outbound Date modal is clickable
        GGiven I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I click the forward arrow icon
        Then the next month options displays
        And the 'NEXT' button in the 'Outbound Date' modal is greyed out


    @automated
    Scenario: Back Arrow icon in Outbound Date modal is clickable
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I click the back arrow icon
        Then the previous month option displays
        And the 'NEXT' button in the 'Outbound Date' modal is greyed out

    @automated
    Scenario: X icon in Outbound Date modal is clickable
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I click the 'X' icon
        Then Outbound Date modal closes
        And the 'Book your journey' page displays

    @automated
    Scenario: Outbound Date modal shows 7 days of the week
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        And the 'Outbound Date' modal shows 7 days of the week in a table


    @automated
    Scenario: The default currency displays in the Outbound Date Modal
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        And the 'Outbound Date' modal displays prices in the default currency for the market

    @automated
    Scenario: Greyed out date is not clickable
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I select a greyed out date
        Then the date is not clickable
        And the 'NEXT' button in the 'Outbound Date' modal is greyed out

    @automated
    Scenario: User user clicks back arrow icon
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I select Date and Ticket on the modal
        Then the 'Outbound Ticket' modal displays
        Then 'Today', 'Tomorrow', 'A day After' date options displays
        And ticket options displays
        When I click the back arrow icon on outbound ticket
        Then previous 5 days options displays

    @automated
    Scenario: User clicks front arrow on 'OutBound Ticket modal'
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I select Date and Ticket on the modal
        Then the 'Outbound Ticket' modal displays
        Then 'Today', 'Tomorrow', 'A day After' date options displays
        And ticket options displays
        When I click the front arrow icon on the outbound ticket
        Then next 5 days options displays

    @automated
    Scenario: The Outbound Ticket modal displays
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I select an active date
        Then the date is highlighted in green
        And the 'NEXT' button in the 'Outbound Date' modal is active
        When the 'NEXT' button in the 'Outbound Date' is clicked
        Then the 'Outbound Ticket' modal displays

    @automated
    Scenario: User selects single journey
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I select an active date
        Then the date is highlighted in green
        And the 'NEXT' button in the 'Outbound Date' modal is active
        When the 'NEXT' button in the 'Outbound Date' is clicked
        Then the 'Outbound Ticket' modal displays
        When I select Single Journey in the 'Outbound Ticket' modal
        Then the date is highlighted in green in the outbound Ticket
        When I click 'DONE' button in the outbound Ticket
        Then the 'Book your journey' page displays

    @manual
    Scenario Outline: Booking summary details matches selection
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I click the 'NEXT' button
        Then the <Outbound Ticket> modal displays
        When I select Single Journey in the 'Outbound Ticket' modal
        When I click 'DONE' button
        Then the <Book your journey> displays
        And <BOOKING SUMMARY> contains the following information
        And 'Add a promotion code' text and text box is present
        Examples:
            | From    | To          | Ticket Type    | Date             | Vehicle Length       | Visitor  | Ticket Price | Sub total | Total  |
            | Elsinor | Helsingborg | Single Journey | 10 February 2023 | Car under 6 meter x1 | Adult x1 | €57.00       | €57.00    | €57.00 |


    @manual
    Scenario Outline: Show less link displays correctly
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When the Route section and VISITORS options is populated
        When I select Date in the outbound section
        Then the 'Outbound Date' modal displays
        When I click the 'NEXT' button
        Then the <Outbound Ticket> modal displays
        When I select Single Journey in the 'Outbound Ticket' modal
        When I click 'DONE' button
        Then the <Book your journey> displays
        When I click 'SHOW LESS' button
        And <BOOKING SUMMARY> contains the following information
        And 'Add a promotion code' text and text box is present
        Examples:
            | From    | To          | Ticket Type    | Date             | Ticket Price | Total  |
            | Elsinor | Helsingborg | Single Journey | 10 February 2023 | €57.00       | €57.00 |



