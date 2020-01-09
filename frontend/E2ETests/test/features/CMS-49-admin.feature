Feature: CMS-49-Admin

    As an Admin
    I want to see project details
    so I can have a clear view of it

    Background: User is logged in
        Given I am on Login page
        And I have logged in as an admin with valid login and valid password
        And I am on Projects page

    Scenario: User can see Project Details page after clicking project tile
        When I choose to see project details
        Then I am on project details page
        And top header is displayed
        And tabs are displayed
        And I can see project details page with all its content

