Feature: Block templates

  As an Admin
  I want to create block templates
  so users can use them when building content


  Background: User is on block templates page
    Given I am on Login page
    And I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
    And I am on 'homepage' page
    And I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
    And I created new project
    And created project is at the top of the list
    And I chose to see project settings
    And I have entered 'templates' tab
    And I am on 'templates' page
    And I chose to see a list of 'block' templates
    And I am on 'block templates' page


  @Test
    Scenario Outline: User can create every type of block template
      When I create block template with <elementType> element <availability> for editors
      Then block template called <elementType> is displayed on the block templates page

      Examples:
        | elementType           | availability  |
#        | 'Markdown'            | 'available'   |
#        | 'Plain text'          | 'available'   |
#        | 'File'                | 'available'   |
#        | 'Image'               | 'available'   |
#        | 'Code'                | 'available'   |
#        | 'Connection'          | 'available'   |
#        | 'Internal Connection' | 'available'   |
#        | 'ObservableHq'        | 'available'   |
#        | 'Embed Video'         | 'available'   |
#        | 'State'               | 'available'   |
        | 'Custom Element'      | 'available'   |
#        | 'Markdown'            | 'unavailable' |
#        | 'Plain text'          | 'unavailable' |
#        | 'File'                | 'unavailable' |
#        | 'Image'               | 'unavailable' |
#        | 'Code'                | 'unavailable' |
#        | 'Connection'          | 'unavailable' |
#        | 'Internal Connection' | 'unavailable' |
#        | 'ObservableHq'        | 'unavailable' |
#        | 'Embed Video'         | 'unavailable' |
#        | 'State'               | 'unavailable' |
#        | 'Custom Element'      | 'unavailable' |




  Scenario Outline: User can create a block template with more than one element
    When I create block template with <elements> elements <availability> for editors
    Then block template called <templateName> is displayed on the block templates page

    Examples:
      | elements               | availability | templateName         |
      | 'Markdown, Markdown'   | 'available'  | 'Markdown Markdown'  |
      | 'Markdown, Plain text' | 'available'  | 'Markdown Plain text' |


    Scenario: User can edit a block template
      Given I created block template with 'markdown' element 'available' for editors
      And block template called 'Markdown' is displayed on the block templates page
      And I chose to edit block template called 'Markdown'
      When I save block template with 'file, code' elements 'unavailable' for editors
      Then block template called 'File Code' is saved with 'file' and 'code' elements 'unavailable' for editors


    Scenario: User can delete a block template
      Given I created block template with 'markdown' element 'available' for editors
      And block template called 'Markdown' is displayed on the block templates page
      When I delete a block template called 'markdown'
      Then block template called 'Markdown' is no longer on the list of block templates

    ##################
    # Negative cases #
    ##################

    Scenario Outline: User cannot create block template if name is too long or empty and without an element type
      When I want to create block template with <templateNameState> name and <elementNameState> element name and <elementType> element
      Then I can see that block template name is <templateNameState>
      And I can see that element name is <elementNameState>
      And button for creating block template is inactive

      Examples:
        | templateNameState | elementNameState | elementType  |
        | 'empty'           | 'empty'          | 'empty'      |
        | 'empty'           | 'valid'          | 'empty'      |
        | 'empty'           | 'too long'       | 'empty'      |
        | 'empty'           | 'empty'          | 'markdown'   |
        | 'empty'           | 'valid'          | 'markdown'   |
        | 'empty'           | 'too long'       | 'markdown'   |
        | 'valid'           | 'empty'          | 'empty'      |
        | 'valid'           | 'too long'       | 'empty'      |
        | 'valid'           | 'empty'          | 'markdown'   |
        | 'valid'           | 'too long'       | 'markdown'   |
        | 'too long'        | 'empty'          | 'empty'      |
        | 'too long'        | 'too long'       | 'empty'      |
        | 'too long'        | 'valid'          | 'empty'      |
        | 'too long'        | 'empty'          | 'markdown'   |
        | 'too long'        | 'too long'       | 'markdown'   |
        | 'too long'        | 'valid'          | 'markdown'   |




    Scenario: User cannot create block template with already existing name
      Given I created block template with 'image' element 'available' for editors
      And block template called 'Image' is displayed on the block templates page
      When I create block template with 'image' element 'available' for editors
      Then I can see that block template name is 'existing'
      And button for creating block template is inactive


    Scenario: Test
      When I create block template with 'all the elements'
      Then block template with 'all the elements' is displayed on the block templates page

