Feature: CMS-49-Admin

    As an Admin 
    I want to see project details 
    so I can have a clear view of it

    Background: User is logged in
        Given I am on Login page
        And I have logged in as an 'admin' 
        And I am on homepage

    Scenario: User can see Project Details page after clicking project tile
        When I choose to see project details
        Then I am on project details page
        And Project Name is displayed
        And Data Sources tile is displayed
        And Users tile is displayed
        And Last Update is displayed
        And Status is displayed
        And Owner is displayed
        And Title is displayed
        And Description is displayed
        And API path is displayed
        And Menu button is displayed
        And Back button is displayed