Feature: CMS-48-Admin

    As an Admin
    I want to see a list of projects with details
    in order to better understand it

    Background: User is on login page
        Given I am on Login page


    Scenario: User can see Projects page with all it's elements
        When I log in as 'admin' with valid login and password
        Then I am on Projects page
        And title of header is Projects
        And subtitle of header is Overview
        And Menu button is displayed
        And it's visible when project was created
        And Status of the project is displayed
        And Owner of the project is displayed
        And Title of the project is displayed
        And Subtitle of the project is displayed
        And API path of the project is displayed
        And Create new project button is displayed


    Scenario: User can see the Settings modal after clicking Menu button
        Given I have logged in as an 'admin'
        When I click on Menu button
        Then I can see the Close button
        And title of header is Projects
        And subtitle of header is Overview
        And I can see Log Out option


    Scenario: User can close the Settings modal by clicking Close button
        Given I have logged in as an 'admin'
        And I have opened menu
        When I close menu
        Then I am on Projects page
        And menu is closed

