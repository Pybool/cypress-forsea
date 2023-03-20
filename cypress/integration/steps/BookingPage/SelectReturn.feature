Feature: Select Dates for InBound 
    As a user I want to select outbound Date
    So I have the correct ticket

    @automated
    Scenario: Add Return button in the Return Section is highlighted 
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'OutBound' section is completed
        Then the 'Add Return' button is highlighted
        And the 'DONE' button is highlighted and clickable


    @automated
    Scenario: Return Date modal is displayed when clicked
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'OutBound' section is completed
        Then the 'Add Return' button is highlighted
        When the 'Add Return' button is clicked
        Then the 'Return Date' modal is displayed

    @automated
    Scenario: Return Date modal shows days of the week
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'OutBound' section is completed
        And 'Items reserved in cart for x:xx minutes' dispalyed
        When the 'Add Return' button is clicked
        Then the 'Return Date' modal is displayed
        And the Modal shows Days of the week

    @automated-skip
    Scenario: User clicks back arrow in 'Return Date modal'
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'OutBound' section is completed
        When the 'Add Return' button is clicked
        Then the 'Return Date' modal is displayed
        When I click the front arrow icon
        Then next 7 days options displays
        When I click the back arrow icon
        Then <Today>, <Tomorrow>, <A day After> date options displays