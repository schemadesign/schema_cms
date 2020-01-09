Feature: CMS-10-Admin

    As an Admin
    I want to start a project
    so that I can do work for the client

    Background: user is logged in
        Given I am on Login page
        And I have logged in as an admin with valid login and valid password
        And I am on homepage


    Scenario: User can see Create New Project page with all its details
        When I choose to create new project
        Then I am on Create New Project page
        And top header is displayed
        And all elements of Create New Project page are displayed properly
    @Test
    Scenario Outline: User can select different status
        Given I chose to create new project
        When I select <status> from dropdown
        Then <status> is displayed

        Examples:
            | status |
            | 'In Progress' |
            | 'Done' |
            | 'Hold' |
            | 'Published' |



    Scenario: Finish button should be inactive if required field is left empty
        Given I chose to create new project
        When required fields are empty
        Then Finish button is not active


    Scenario: Validation message should be displayed if title and description are too long
        Given I chose to create new project
        When I enter title and description longer than required
        Then validation message about title being too long is displayed
        And validation message about description being too long is displayed


    Scenario: When adding a project, user can edit entered data
        Given I chose to create new project
        And I filled out all required fields
        When I edit the data
        Then new data in fields is displayed


    Scenario: Newly created project should be displayed on Projects page at the top of the list
        Given I chose to create new project
        And I filled out all required fields
        When I submit the form to create new project
        Then I am on Projects page
        And created project is at the top of the list
