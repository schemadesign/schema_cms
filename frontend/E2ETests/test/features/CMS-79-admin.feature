Feature: CMS-79-Admin

    As an Admin
    I want to see the Data Sources page
    so that I can see created dataset


    Background: User is logged in
        Given I am on Login page
        And I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
        And I chose to see project settings

    Scenario: User can see newly created data source
        Given I chose to see a list of data sources
        When I choose to upload a 'valid' CSV file
        Then I am on 'datasource' page
        And I can see status of file updating on the tile
        And data source created by 'existing admin' is displayed on the list


    Scenario: Number of data sources is equal to the number on Datasources tile
        When I choose to see a list of data sources
        Then I am on 'datasource' page
        And the number of data sources is equal to the number on Datasources tile




