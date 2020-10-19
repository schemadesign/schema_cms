Feature: CMS-798

  As an Admin
  I want to create tag templates
  so users can apply tag to both pages and datasets


  Background: User is on tag templates page
    Given I am on Login page
    And I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
    And I am on 'homepage' page
    And I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
    And I created new project
    And created project is at the top of the list
    And I chose to see project settings
    And I have entered 'templates' tab
    And I am on 'templates' page
    And I chose to see a list of 'tag' templates
    And I am on 'tag templates' page


  Scenario Outline: User can create every type of tag template
    When I create <numOfTags> <choiceType> choice <applicability> tags which are <availability> for editors
    Then created tag template is displayed on the tag templates page

      Examples:
        | numOfTags | choiceType | applicability | availability  |
        | 3         | 'single'   | 'dataset'     | 'available'   |
        | 3         | 'single'   | 'content'     | 'available'   |
        | 3         | 'single'   | 'mixed'       | 'available'   |
        | 3         | 'single'   | 'dataset'     | 'unavailable' |
        | 3         | 'single'   | 'content'     | 'unavailable' |
        | 3         | 'single'   | 'mixed'       | 'unavailable' |
        | 3         | 'multi'    | 'dataset'     | 'available'   |
        | 3         | 'multi'    | 'content'     | 'available'   |
        | 3         | 'multi'    | 'mixed'       | 'available'   |
        | 3         | 'multi'    | 'dataset'     | 'unavailable' |
        | 3         | 'multi'    | 'content'     | 'unavailable' |
        | 3         | 'multi'    | 'mixed'       | 'unavailable' |


  Scenario Outline: Creating tag template with empty or too long name is not possible
    When I want to create a tag template with <nameState> name
    Then I can see a warning that tag template name is <nameState>
    And button for creating tag template is inactive

    Examples:
      | nameState  |
      | 'empty'    |
      | 'too long' |


  Scenario Outline: Creating tag template with duplicated or too long tag names is not possible
    When I want to create a tag template with <tagState> tag name
    Then I can see a warning that tag name is <tagState>
    And button for creating tag template is inactive

    Examples:
      | tagState     |
      | 'existing'   |
      | 'too long'   |


  Scenario: Creating tag template with already existing name is not possible
    Given I created 1 'single' choice 'dataset' tag which is 'available' for editors
    And created tag template is displayed on the tag templates page
    When I create 1 'single' choice 'dataset' tag which is 'available' for editors
    Then I can see a warning that tag template with that name already exists


  Scenario: User can edit created tag template
    Given I created 1 'single' choice 'dataset' tag which is 'available' for editors
    And created tag template is displayed on the tag templates page
    And I chose to edit a 'Dataset Single Available' tag template
    When I edit tag template to have 2 'multi' choice 'content' tags 'unavailable' for editors
    Then 'Content Multi Unavailable' tag template is saved with 2 'multi' choice 'content' tags 'unavailable' for editors


  Scenario: User can delete a tag template
    Given I created 1 'single' choice 'dataset' tag which is 'available' for editors
    And created tag template is displayed on the tag templates page
    When I delete a tag template called 'Dataset Single Available'
    Then 'Dataset Single Available' tag template is not on the list of tag templates
