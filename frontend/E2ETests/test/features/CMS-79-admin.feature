Feature: CMS-79-Admin

    As an Admin
    I want to see a Data Sources page
    so that I can see created dataset


    Background: User is logged in
        Given I am on Login page
        And I have logged in as an admin with valid login and valid password
        And I have entered project details page


    Scenario: User can see Data Sources page with all its elements
        When I choose to see list of data sources
        Then I am on Data Sources page
        And top header is displayed
        And tabs are displayed
        And I can see Data Sources page with all its elements




