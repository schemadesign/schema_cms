Feature: CMS-10-Admin

    As an Admin
    I want to start a project
    so that I can do work for the client

    Background: user is logged in
        Given I am on Login page
        And I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
        And I am on 'homepage' page


    Scenario Outline: User can select different project status
        Given I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
        When I select <status> status from dropdown
        Then <status> status is displayed

        Examples:
            | status        |
            | 'Done'        |
            | 'Published'   |
            | 'Hold'        |
            | 'In Progress' |



    Scenario: Finish button should be inactive if required field is left empty
        Given I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
        When required fields are empty
        Then Finish button is not active


    Scenario: Validation message should be displayed if title and description are too long
        Given I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
        When I enter title and description longer than required
        Then validation message about title being too long is displayed
        And validation message about description being too long is displayed



    Scenario: Validation message should be displayed if domain is not a valid URL
        Given I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
        When I enter an invalid domain
        Then validation message about invalid domain is displayed



    Scenario: When adding a project, user can edit entered data
        Given I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
        When I edit the data
        Then new data in fields is displayed

    @CreateProject
    Scenario: Newly created project should be displayed on Projects page at the top of the list
        Given I chose to create new project as an 'admin' 'existing' in 'Schema CMS'
        When I create new project
        Then I am on 'homepage' page
        And created project is at the top of the list
