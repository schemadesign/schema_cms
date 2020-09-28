Feature: CMS-48-Admin

    As an Admin
    I want to see a list of projects with details
    in order to better understand it

    Background: User is on login page
        Given I am on Login page


    Scenario: User can see Projects page with all its elements
        When I log in as an 'existing admin' user with 'valid' login and 'valid' password
        Then I am on 'homepage' page
        And I can see Projects page with all its elements


    Scenario: User can close menu
        Given I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
        And I have opened menu
        And I can see menu with all its content
        When I close menu
        Then menu is no longer displayed



