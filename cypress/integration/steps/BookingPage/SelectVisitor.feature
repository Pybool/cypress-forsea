Feature: Select Visitors
    As a user I want to select Visitors
    So I purchase the right ticket

    @automated
    Scenario Outline: User selects one adult option
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When I click the "Visitors" field in the Booking Page
        Then I should see "Select Visitors" modal in Booking page
        When I click adult "<plus>" button on the modal
        Then I click "Done" button from the modal
        And The 'Book your journey' heading is displayed on the top left hand side
        Examples:
            | Selection | plus |
            | Adult 1   | 1 |
            | Adult 2   | 2 |
            | Adult 3   | 3 |
            | Adult 4   | 4 |
            | Adult 5   | 5 |
            | Adult 6   | 6 |
            | Adult 7   | 7 |
            | Adult 8   | 8 |
            | Adult 9   | 9 |

    @automated
    Scenario Outline: User selects more than 9 adults
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When I click the "Visitors" field in the Booking Page
        Then I should see "Select Visitors" modal in Booking page
        When I click adult "<plus>" button on the modal
        Then the adult "+" button is greyed out and not clicakable
        Then the child "+" button is greyed out and not clicakable
        Then I click "Done" button from the modal
        And The 'Book your journey' heading is displayed on the top left hand side
        Examples:
            | Selection | plus |
            | Adult 9   | 9 |

    @automated
    Scenario Outline: User selects a combination of adults and children
        Given I am a user of ForSea
        When I visit the Booking page
        When the 'Sweden, Helsingborg' and 'Denmark, Elsinor' fields are populated on the To and From field
        When I select "Car under 6 meter" from the vehicle modal
        When I click the "Visitors" field in the Booking Page
        Then I should see "Select Visitors" modal in Booking page
        When I click adult "<Adult_plus>" button on the modal
        When I click child "<Child_plus>" button on the modal
        Then the adult "+" button is greyed out and not clicakable
        Then the child "+" button is greyed out and not clicakable
        Then I click "Done" button from the modal
        And The 'Book your journey' heading is displayed on the top left hand side

        Examples:
            | Adult_plus | Child_plus |
            | 8      | 1                   |
            | 7      | 2                   |
            | 6      | 3                   |
            | 5      | 4                   |
            | 4      | 5                   |
            | 3      | 6                   |
            | 2      | 7                   |
            | 1      | 8                   |