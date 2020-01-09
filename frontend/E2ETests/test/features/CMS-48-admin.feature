Feature: CMS-48-Admin

    As an Admin
    I want to see a list of projects with details
    in order to better understand it

    Background: User is on login page
        Given I am on Login page


    Scenario: User can see Projects page with all its elements
        When I log in as admin with valid login and valid password
        Then I am on Projects page
        And top header is displayed
        And I can see Projects page with all its elements


    Scenario: User can open menu
        Given I have logged in as an admin with valid login and valid password
        When I open menu
        Then I can see menu with all its content

    
    Scenario: User can close menu
        Given I have logged in as an admin with valid login and valid password
        And I have opened menu
        When I close menu
        Then I am on Projects page


