Feature: Sanity test run for invited user with admin role
  As an admin
  I want to create a project with all its artifacts
  so I can quickly make sure that the app is fully functional

  Scenario: After being invited to the Schema CMS, invited user creates new project with all its artifacts
    # CMS-6: inviting new user from Django
    Given django admin is logged in admin panel
    When 'django' admin invites me to Schema CMS as an 'existing admin'
    Then Admin can see a message in 'django' that 'existing admin' with this email already exists
    When 'django' admin invites me to Schema CMS as an 'invited admin'
    Then django admin can see confirmation that I was added as an 'admin'
    And I appear in the list of users as an 'admin'
    And my user status as an 'admin' is set to 'inactive'
    And I received an email with the invitation link
    When I set new password as an 'invited admin'
    Then I am on Login page
#   # CMS-7: logging in
    And I can log in to Schema CMS as an 'admin' 'invited' from 'django'
    And I am on 'homepage' page
    And my personal information as an 'admin' 'invited' from 'django' is displayed in the profile
    # CMS-280: inviting new user from app - negative case
    When 'Schema CMS' admin invites me to Schema CMS as an 'existing admin'
    Then Admin can see a message in Schema CMS that user with this email already exists
    # CMS-280: inviting new user from app - positive case
    Given 'Schema CMS' admin invites me to Schema CMS as an 'invited admin'
    And I received an email with the invitation link
    When I set new password as an 'invited admin'
    Then I can log in to Schema CMS as an 'admin' 'invited' from 'Schema CMS'
    And my personal information as an 'admin' 'invited' from 'Schema CMS' is displayed in the profile
    # CMS-10: creating project: negative cases
    Given I chose to create new project as an 'admin' 'invited' from 'Schema CMS'
    When required fields are empty
    # Then Finish button is not active <= waiting for fix in CMS-1423
    When I enter title and description longer than required
    Then validation message about title being too long is displayed
    And validation message about description being too long is displayed
    When I enter an invalid domain
    Then validation message about invalid domain is displayed
    # CMS-10: creating project: positive cases
    When I select 'Done' status from dropdown
    Then  'Done' status is displayed
    When I select 'Published' status from dropdown
    Then  'Published' status is displayed
    When I select 'Hold' status from dropdown
    Then  'Hold' status is displayed
    When I select 'In Progress' status from dropdown
    Then  'In Progress' status is displayed
    When I create new project
    Then I am on 'homepage' page
    And created project is at the top of the list
    # CMS-48: seeing homepage with created project
    And I can see Projects page with all its elements
    # CMS-48: opening/closing menu
    Given I have opened menu
    And I can see menu with all its content
    When I close menu
    Then menu is no longer displayed
    # CMS-49:  seeing project details page
    When I choose to see project settings
    Then I am on 'project details' page
    And I can see the project settings page with all its content
    And project settings match the data on the tile
    # CMS-798: creating tag templates
    Given I have entered 'templates' tab
    And I am on 'templates' page
    And I chose to see a list of 'tag' templates
    And I am on 'tag templates' page
    When I create 3 'single' choice 'dataset' tags which are 'available' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'single' choice 'content' tags which are 'available' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'single' choice 'mixed' tags which are 'available' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'single' choice 'dataset' tags which are 'unavailable' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'single' choice 'content' tags which are 'unavailable' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'single' choice 'mixed' tags which are 'unavailable' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'multi' choice 'dataset' tags which are 'available' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'multi' choice 'content' tags which are 'available' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'multi' choice 'mixed' tags which are 'available' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'multi' choice 'dataset' tags which are 'unavailable' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'multi' choice 'content' tags which are 'unavailable' for editors
    Then created tag template is displayed on the tag templates page
    When I create 3 'multi' choice 'mixed' tags which are 'unavailable' for editors
    Then created tag template is displayed on the tag templates page
    When I leave tag templates page
    Then I am on 'templates' page
    # Creating block templates
    When I create block template with 'all the elements'
    Then block template with 'all the elements' is displayed on the block templates page
    # CMS-26: creating a data source
    Given I have entered 'sources' tab
    When I choose to upload a 'valid' CSV file
    Then I am on 'datasource' page
    And I can see status of file updating on the tile
    And data source created by 'invited admin' is displayed on the list
    # CMS-26: previewing a data source
    When I choose to see data source preview
    Then I am on 'datasource preview' page
    And subheader for 'datasource preview' page is displayed
    And data in preview table matches data from CSV file
    When I choose to see field info preview
    Then data in field preview table matches data from CSV file
    # CMS-22: selecting/previewing scripts on the Steps page
    When I navigate to 'steps' page
    Then I can see a list of predefined scripts
    When I chose to preview an 'image scraping' script
    Then I can see 'image scraping' script code on preview page
    And I can see columns with URL
    When I 'select' a 'lowercase' script
    Then 'lowercase' script is 'selected'
    And the 'lowercase' script is moved to the list of 'selected' scripts
    And the 'lowercase' script is no longer on the list of 'deselected' scripts
    When I 'deselect' a 'lowercase' script
    Then 'lowercase' script is 'deselected'
    And the 'lowercase' script is moved to the list of 'deselected' scripts
    And the 'lowercase' script is no longer on the list of 'selected' scripts
    # CMS-22: processing the data source with default script
    Given I have navigated to 'steps' page
    And I chose to process data source with 'default' 'lowercase' script
    When I choose to see data source preview
    Then I am on 'datasource results' page
    And data in table is 'lowercase'
    # CMS-22: processing the data source with uploaded script
    Given I have navigated to 'steps' page
    And I chose to process data source with 'uploaded' 'uppercase' script
    When I choose to see data source preview
    Then I am on 'datasource results' page
    And data in table is 'uppercase'
    # CMS-79: number of data sources on tile is equal to the number of data sources on the list
    Given I have entered 'settings' tab
    When I choose to see a list of data sources
    Then I am on 'datasource' page
    And the number of data sources is equal to the number on Datasources tile
    # CMS-8: resetting forgotten password - negative case
    Given I have logged out
    And I am on Login page
    And I provided 'valid' email to recover my password
    And I used reset link sent to me
    And I am on 'reset password' page
    When I provide passwords that don't match
    Then I am informed that my new password is not created
    # CMS-8: resetting forgotten password - positive case
    When I provide matching passwords
    Then I am informed that my new password is created
    And I am able to log in using 'reset' password



