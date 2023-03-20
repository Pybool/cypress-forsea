Feature: Payment Page displays
    As a user I should see payment page

    @automated
    Scenario: Make Payment button is active 
	    Given I am a user of ForSea
        When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'The OutBound' section is completed
        When 'DONE' button is selected 
        Then 'YOUR DETAILS' page displays with six '<Text>' boxes
        When correct detail is entered in the 'details page'
        Then 'Make Payment' button is active
    
    @automated
    Scenario: Payment Page should display
	    Given I am a user of ForSea
        When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'The OutBound' section is completed
        When 'DONE' button is selected 
        Then 'YOUR DETAILS' page displays with six '<Text>' boxes
        When correct detail is entered in the 'details page'
        Then 'Make Payment' button is active
        When 'Make Payment' button is clicked
        Then 'Payment Details' page displays

    @automated
    Scenario: Payment Page shows card information
	    Given I am a user of ForSea
        When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'The OutBound' section is completed
        When 'DONE' button is selected 
        Then 'YOUR DETAILS' page displays with six '<Text>' boxes
        When correct detail is entered in the 'details page'
        When 'Make Payment' button is clicked
        Then 'Payment Details' page displays
        Then 'Payment Details' contains Add card radio button, Card number ,expiry, CVC

    @manual
    Scenario: Payment Page shows MobilePay
	    Given I am a user of ForSea
        When I am on Book your journey page
		And 'Route' section is completed
        And 'How' section is completed
        And 'The OutBound' section is completed
        When 'DONE' button is selected 
        Then 'YOUR DETAILS' page displays with six '<Text>' boxes
        When correct detail is entered in the 'details page'
        When 'Make Payment' button is clicked
        Then 'Payment Details' page displays
        Then 'Payment Details' contains 

        # Add card radio button
        # Card number 
        # expiry 
        # CVC

    # @manual
    # Scenario: Payment amount should match cost price 