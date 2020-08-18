Feature: CMS-26-Editor

  As an Editor
  I want to be able to preview the uploaded data
  so that I can confirm it is what I wanted to be uploaded

  Background: User uploaded a valid CSV file
    Given I am on Login page
    And  I have logged in as an 'admin' with 'valid' login and 'valid' password
    And I choose to see project settings
    And I have entered 'sources' tab


  Scenario: User can see newly created data source
    When I choose to upload a 'valid' CSV file
    Then I am on 'datasource' page
    And I can see status of file updating on the tile
    And newly created data source is displayed on the list


  Scenario: Data in preview table matches the data from CSV file
    Given I chose to upload a 'valid' CSV file
    And I am on 'datasource' page
    And I can see status of file updating on the tile
    And newly created data source is displayed on the list
    When I choose to see data source preview
    Then I am on 'datasource preview' page
    And subheader for 'datasource preview' page is displayed
    And data in preview table matches data from CSV file


  Scenario: Field Preview page matches design
    Given I chose to upload a 'valid' CSV file
    And I am on 'datasource' page
    And I can see status of file updating on the tile
    And newly created data source is displayed on the list
    And I chose to see data source preview
    And I am on 'datasource preview' page
    And subheader for 'datasource preview' page is displayed
    And data in preview table matches data from CSV file
    When I choose to see field info preview
    Then data in field preview table matches data from CSV file




