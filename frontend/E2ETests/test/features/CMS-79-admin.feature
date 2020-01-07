Feature: CMS-79-Admin

    As an Admin
    I want to see a Datasources page
    so that I can see created datasets


    Background: User is logged in
        Given I am on Login page
        And I have logged in as an 'admin'
        And I have entered project details page


    Scenario: User can see Data Sources page with all its elements
        When I choose to see list of data sources
        Then I am on Data Sources page
        And Header is displayed
        And Subheader is displayed
        And date of creation is displayed
        And name of creator is displayed
        And source of the dataset is displayed
        And number of items in dataset is displayed
        And number of fields in dataset is displayed
        And there is no filters amount specified
        And there is no views amount specified
        And Back button on Data Sources page is displayed
        And Create data source button is displayed


    Scenario: User can navigate back to project details page
        Given I have entered Data Sources page
        When I choose to navigate back to the Projects page
        Then I am on project details page



