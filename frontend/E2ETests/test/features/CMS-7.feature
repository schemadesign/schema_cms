Feature: CMS-7

    As an Admin/Editor
    I want to log in to the CMS
    so that I can securely store client data

    Background: User is on login page
        Given I am on Login page


    Scenario Outline: User can log in if login and password are valid
        When I log in as an <userRole> with <loginState> login and <passwordState> password
        Then I am on 'homepage' page
        And my <userRole> personal information is displayed in the profile

        Examples:
            | userRole | loginState | passwordState |
            | 'admin'  | 'valid'    | 'valid'       |
            | 'editor' | 'valid'    | 'valid'       |


    Scenario Outline: User cannot log in if login and/or password is invalid or empty
        When I log in as an <user> with <loginState> login and <passwordState> password
        Then I see that login is <loginState> and password is <passwordState>
        Then I am not logged in

        Examples:
            | user      | loginState | passwordState |
            | 'admin'   | 'empty'    | 'empty'       |
            | 'admin'   | 'invalid'  | 'invalid'     |
            | 'admin'   | 'invalid'  | 'empty'       |
            | 'admin'   | 'invalid'  | 'valid'       |
            | 'admin'   | 'empty'    | 'invalid'     |
            | 'admin'   | 'empty'    | 'valid'       |
            | 'admin'   | 'valid'    | 'invalid'     |
            | 'admin'   | 'valid'    | 'empty'       |
            | 'editor'  | 'invalid'  | 'invalid'     |
            | 'editor'  | 'invalid'  | 'empty'       |
            | 'editor'  | 'invalid'  | 'valid'       |
            | 'editor'  | 'empty'    | 'invalid'     |
            | 'editor'  | 'empty'    | 'empty'       |
            | 'editor'  | 'empty'    | 'valid'       |
            | 'editor'  | 'valid'    | 'invalid'     |
            | 'editor'  | 'valid'    | 'empty'       |

