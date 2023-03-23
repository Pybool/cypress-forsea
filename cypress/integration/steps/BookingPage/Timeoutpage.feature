Feature: Timeout modal displays
    As a user I should see timeout modal
    

    @automatings
    Scenario: Countdown message displays when time expires for single journey
	  Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays with six '<Text>' boxes
    And The timer exceed allocated time
    # Then 'Sorry... Time is up' modal displays
    # And 'Try again' button displays in the modal
    # And 'Login to my account' button displays in the modal

  #   @manual
  #   Scenario: Countdown message displays when time expires for return journey
	# 	Given I am a user of ForSea
	# 	When I am on Book your journey page
	# 	And 'Route' section is completed
  #   And 'How' section is completed
  #   And 'OutBound' section is completed
  #   And 'Return' section is completed 
  #   When 'DONE' button is selected 
  #   Then 'YOURDETAILS' page displays
  #   And timer exceed allocated time
  #   Then 'Sorry... Time is up' modal displays
  #   And 'Try again' button displays in the modal
  #   And 'Login to my account' button displays in the modal

  #   @manual
  #   Scenario: User directed to main page after time expires
	# Given I am a user on ForSea
	# When I am on Book your journey page
	# And 'Route' section is completed
  #   And 'How' section is completed
  #   And 'OutBound' section is completed
  #   When 'DONE' button is selected 
  #   Then 'YOURDETAILS' page displays
  #   And timer exceed allocated time
  #   Then 'Sorry... Time is up' modal displays
  #   And 'Try again' button displays in the modal
  #   When user click 'Try again' button
  #   Then user is directed to Main Page


  #   @manual
  #   Scenario: User directed to login page after time expires
	# 	Given I am a user of ForSea
	# 	When I am on Book your journey page
	# 	And 'Route' section is completed
  #   And 'How' section is completed
  #   And 'OutBound' section is completed
  #   When 'DONE' button is selected 
  #   Then 'YOURDETAILS' page displays
  #   And timer exceed allocated time
  #   Then 'Sorry... Time is up' modal displays
  #   And 'Login to my account' button displays in the modal
  #   When user click 'Login to my account' button
  #   Then user is directed to the Login Page