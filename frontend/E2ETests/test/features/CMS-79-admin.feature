Feature: CMS-79-Admin

    As an Admin
    I want to see the Data Sources page
    so that I can see created dataset


    Background: User is logged in
        Given I am on Login page
        And I have logged in as an 'admin' with 'valid' login and 'valid' password
        And I chose to see project settings


    Scenario: User can see the Data Sources page with all its elements
        When I choose to see a list of data sources
        Then I am on 'datasource' page
        And the number of data sources is equal to the number on Datasources tile




