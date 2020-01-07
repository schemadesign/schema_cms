Feature: CMS-7

    As an Admin/Editor
    I want to log in to the CMS
    so that I can securely store client data

    Background: User is on login page
        Given I am on Login page


    Scenario Outline: User can log in if login and password are valid
        When I log in as <user> with valid login and password
        Then I am on Projects page

        Examples:
            | user     |
            | 'admin'  |
            | 'editor' |


    # NEGATIVE PATH

    Scenario: User cannot log in if both login and password are invalid
        When I log in with 'invalid' login and 'invalid' password
        Then I am informed about invalid login or password


    Scenario: User cannot log in if login is invalid
        When I log in with 'invalid' login and 'valid' password
        Then I am informed about invalid login or password

    Scenario: User cannot log in if password is invalid
        When I log in with 'valid' login and 'invalid' password
        Then I am informed about invalid login or password

    Scenario: User cannot log in if both login and password are empty
        When I log in with 'empty' login and 'empty' password
        Then I am informed about empty login and password

    Scenario: User cannot log in if login is empty
        When I log in with 'empty' login and 'valid' password
        Then I am informed about empty login

    Scenario: User cannot log in if password is empty
        When I log in with 'valid' login and 'empty' password
        Then I am informed about empty password
