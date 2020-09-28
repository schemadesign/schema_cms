Feature: CMS-22

  As an Admin
  I want to process my data with a data wrangling script
  so that I can display clean data in a visualization

  Background: User uploaded a CSV file
    Given I am on Login page
    And  I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
    And I am on 'homepage' page
    And I choose to see project settings
    And I choose to see a list of data sources
    And I am on 'datasource' page
    And I chose to upload a 'valid' CSV file
    And I am on 'datasource' page
    And I can see status of file updating on the tile
    And data source created by 'existing admin' is displayed on the list
    And I chose to see data source preview
    And I am on 'datasource preview' page


  Scenario: User can see list of predefined scripts
    When I navigate to 'steps' page
    Then I can see a list of predefined scripts


  Scenario Outline: User can select and deselect the script
    Given I have navigated to 'steps' page
    When I <action> a 'lowercase' script
    Then 'lowercase' script is <scriptState>

      Examples:
        | action     | scriptState   |
        | 'select'   | 'selected'    |
        | 'deselect' | 'deselected'  |


  Scenario: Selected script is moved to a list with selected scripts
    Given I have navigated to 'steps' page
    When I 'select' a 'lowercase' script
    Then the 'lowercase' script is moved to the list of 'selected' scripts
    And the 'lowercase' script is no longer on the list of 'deselected' scripts


  Scenario: User can preview a script
    Given I have navigated to 'steps' page
    When I chose to preview an 'image scraping' script
    Then I can see 'image scraping' script code on preview page


  Scenario: User can select columns with URL for Image Scraping script
    Given I have navigated to 'steps' page
    When I chose to preview an 'image scraping' script
    Then I can see columns with URL


  Scenario Outline: User can process data source using data wrangle script
    Given I have navigated to 'steps' page
    And I chose to process data source with <scriptType> <dataFormat> script
    When I choose to see data source preview
    Then I am on 'datasource results' page
    And data in table is <dataFormat>

    Examples:
      | scriptType | dataFormat    |
      | 'uploaded' | 'uppercase' |
      | 'default'  | 'lowercase' |



