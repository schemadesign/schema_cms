Feature: CMS-7

    As an Admin/Editor
    I want to log in to the CMS
    so that I can securely store client data

    Background: User is on login page
        Given I am on Login page

    @Test
    Scenario Outline: User can log in if login and password are valid
        When I log in as <user> with <loginState> login and <passwordState> password
        Then I am on Projects page

        Examples:
            | user | loginState | passwordState |
            | admin | valid | valid |
            | editor | valid | valid |


    # NEGATIVE PATH

    Scenario Outline: User cannot log in if both login and password are invalid
        When I log in as <user> with <loginState> login and <passwordState> password
        Then I am informed about invalid login or password

        Examples:
            | user | loginState | passwordState |
            | admin | invalid | invalid |
            | editor | invalid | invalid |


    Scenario Outline: User cannot log in if login is invalid
        When I log in as <user> with <loginState> login and <passwordState> password
        Then I am informed about invalid login or password

        Examples:
            | user | loginState | passwordState |
            | admin | invalid | valid |
            | editor | invalid | valid |

    Scenario Outline: User cannot log in if password is invalid
        When I log in as <user> with <loginState> login and <passwordState> password
        Then I am informed about invalid login or password

        Examples:
            | user | loginState | passwordState |
            | admin | valid | invalid |
            | editor | valid | invalid |

    Scenario Outline: User cannot log in if both login and password are empty
        When I log in as <user> with <loginState> login and <passwordState> password
        Then I am informed about empty login and password

        Examples:
            | user | loginState | passwordState |
            | admin | empty | empty  |
            | editor | empty | empty |

    Scenario Outline: User cannot log in if login is empty
        When I log in as <user> with <loginState> login and <passwordState> password
        Then I am informed about empty login

        Examples:
            | user | loginState | passwordState |
            | admin | empty | valid  |
            | editor | empty | valid |

    Scenario Outline: User cannot log in if password is empty
        When I log in as <user> with <loginState> login and <passwordState> password
        Then I am informed about empty password

        Examples:
            | user | loginState | passwordState |
            | admin | valid | empty  |
            | editor | valid | empty |
