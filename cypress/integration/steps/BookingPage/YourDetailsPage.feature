Feature: Visit Your Detail page
    As a user I want to visit the detail page
    So I can provide my correct details

    @automating
    Scenario: Your Detail Page displays for single journey 
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    And 'Booking Summary' section matches booking information

    @automating
    Scenario: Your Detail Page displays for return journey 
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    And 'Return' section is completed 
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    And 'Booking Summary' section matches booking information for round trip

    @automating
    Scenario Outline: Your Detail Page contains six text boxes 
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays with six '<Text>' boxes
    
      Examples:
        |Text 1    |Text 2   |Text 3       |Text 4  |Text 5       |
        |First name|Last name|Phone number |Email   |Confirm Email|

    @automating
    Scenario Outline: Your Detail Page contains two checkboxes 
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays with two <check boxes>
    
      Examples:
        |Checkbox 1                                                       |Checkbox 2                                                        |
        |I approve ForSea Ferries terms and conditions and privacy policy |I would like to get information and newsletter from ForSea Ferries|

    @automating
    Scenario: Make Payment button is highlighted when text boxes is not filled 
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    And 'Make Payment' button is highlighted in red

    @automating
    Scenario: Error message displays when a field is in focus 
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    When I click inside a 'Text Box' and clcik in the next input the '* Required field' message is displayed

    @automating
    Scenario Outline: Error message displays when wrong information is entered in Phone field
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    When I enter "<Wrong information>" in "<Field>" field text Box
    And I tick 'I approve ForSea Ferries terms and conditions and privacy policy' Checkbox
    Then 'Please fill in the required items' message is displayed

     Examples:
        |Wrong information|Field|
        |@@@###$$$    | Phone number   |
   

    @automating
    Scenario Outline: Error message displays when wrong information is entered in Email field
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    When I enter "<Wrong information>" in "<Field>" field text Box
    And I tick 'I approve ForSea Ferries terms and conditions and privacy policy' Checkbox
    Then 'Please fill in the required items' message is displayed

      Examples:
        |Wrong information|Field|
        |@@@###$$$    | Email   |
   
    @automating
    Scenario Outline: Error message displays when wrong information is entered in Confirm Email field
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    When I enter "<Wrong information>" in "<Field>" field text Box
    And I tick 'I approve ForSea Ferries terms and conditions and privacy policy' Checkbox
    Then 'Please fill in the required items' message is displayed

      Examples:
        |Wrong information|Field|
        | @@@###$$$      |Confirm Email   |

    @automating
    Scenario Outline: Error message displays when wrong information is entered in First name field
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    When I enter "<Wrong information>" in "<Field>" field text Box
    And I tick 'I approve ForSea Ferries terms and conditions and privacy policy' Checkbox
    Then 'Please fill in the required items' message is displayed

      Examples:
        |Wrong information|Field|
        |123456789      |First name   |

    @automating
    Scenario Outline: Error message displays when wrong information is entered in Last name field
		Given I am a user of ForSea
		When I am on Book your journey page
		And 'Route' section is completed
    And 'How' section is completed
    And 'The OutBound' section is completed
    When 'DONE' button is selected 
    Then 'YOUR DETAILS' page displays
    When I enter "<Wrong information>" in "<Field>" field text Box
    And I tick 'I approve ForSea Ferries terms and conditions and privacy policy' Checkbox
    Then 'Please fill in the required items' message is displayed

      Examples:
        |Wrong information|Field|
        |123456789      |Last name   |
    