Feature: CMS-22

  As an Admin
  I want to process my data with a data wrangling script
  so that I can display clean data in a visualization

  Background: User uploaded a CSV file
    Given I am on Login page
    And  I have logged in as an 'admin' with 'valid' login and 'valid' password
    And I am on 'homepage' page
    And I choose to see project settings
    And I choose to see a list of data sources
    And I am on 'datasource' page
    And I chose to upload a 'valid' CSV file
    And I am on 'datasource' page
    And I can see status of file updating on the tile
    And newly created data source is displayed on the list
    And I chose to see data source preview
    And I am on 'datasource preview' page


  Scenario: User can see list of predefined scripts
    When I navigate to Steps page
    Then I can see a list of predefined scripts


  Scenario Outline: User can select and deselect the script
    Given I have navigated to Steps page
    When I <action> a script
    Then script gets <scriptState>

      Examples:
        | action   | scriptState   |
        | select   | selected      |
        | deselect | deselected    |


  Scenario: Selected script is moved to a list with selected scripts
    Given I have navigated to Steps page
    When I select a script
    Then the script is moved to the list of selected scripts
    And the script is no longer on the default list


  Scenario: User can preview a script
    Given I have navigated to Steps page
    When I chose to preview a script
    Then I can see script code on preview page


  Scenario: User can select columns with URL for Image Scraping script
    Given I have navigated to Steps page
    When I select an Image Scraping script
    Then I can see columns with URL


  Scenario: User can upload custom script
    Given I have navigated to Steps page
    When I choose to upload a custom script
    Then uploaded script is at the top of the list


  Scenario Outline: User can process data source using data wrangle script
    Given I have navigated to Steps page
    And I chose to process data source with <scriptType> script
    When I choose to see data source preview
    Then I am on 'datasource results' page
    And data in table is <dataFormat>

    Examples:
      | scriptType | dataFormat  |
      | uploaded   | upper cased |
      | default    | lower cased |



