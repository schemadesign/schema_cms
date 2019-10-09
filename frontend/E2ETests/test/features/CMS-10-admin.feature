Feature: CMS-10-Admin

    As an Admin
    I want to start a project 
    so that I can do work for the client

    
    Background: user is logged in
        Given I am on Login page
        Given I have logged in as an 'admin' 
        And I am on Projects page
    
    @Test
    Scenario: User can see Create New Project page with all its details
        When I choose to create a project
        Then I am on Create New Project page
        And title of header is Create New Project
        And subtitle of header is Project Info
        And Menu button is displayed
        And Title field is displayed
        And title placeholder is displayed
        And Description field is displayed
        And Description placeholder is displayed
        And Owner field is displayed
        And Status dropdown is displayed
        And default status is displayed
        And Cancel button is displayed
        And Submit button is displayed
        
    Scenario Outline: User can select different status
        Given I am on Create New Project page
        When I select <status> from dropdown
        Then <status> is displayed

        Examples:
            | status |
            | 'In Progress' |
            | 'Done' |
            | 'Hold' |
            | 'Published' |



    Scenario: Validation message should be displayed if required field is left empty
        Given I am on Create New Project page
        And required fields are empty
        When I submit the form to create new project
        Then validation message about empty fields is displayed
    

    Scenario: Validation message should be displayed if title is too short
        Given I am on Create New Project page
        And title is too short
        When I submit the form to create new project
        Then validation message about title being too short is displayed
        

    Scenario: Validation message should be displayed if title and description are too long
        Given I am on Create New Project page
        And title is too long
        And description is too long
        When I submit the form to create new project
        Then validation message about title being too long is displayed
        And validation message about description being too long is displayed


    Scenario: When adding a project, user can edit entered data
        Given I am on Create New Project page
        And I filled out all required fields
        When I edit the data
        Then new data in fields is displayed 

    Scenario: Newly created project should be displayed on Projects page at the top of the list
        Given I am on Create New Project page
        And I filled out all required fields
        When I submit the form to create new project
        Then I am on Projects page
        And created project is at the top of the list
    