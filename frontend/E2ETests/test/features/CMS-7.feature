Feature: CMS-7

    As an Admin/Editor
    I want to log in to the CMS
    so that I can securely store client data

    Background: User is on login page
        Given I am on Login page


    Scenario Outline: User can log in if login and password are valid
        When I log in as an <combinedUserRole> user with <loginState> login and <passwordState> password
        Then I am on 'homepage' page
        And my personal information as an <userRole> <userType> in 'Schema CMS' is displayed in the profile

        Examples:
            | userRole | userType   | combinedUserRole  | loginState | passwordState |
            | 'admin'  | 'existing' | 'existing admin'  | 'valid'    | 'valid'       |
            | 'editor' | 'existing' | 'existing editor' | 'valid'    | 'valid'       |



    Scenario Outline: User cannot log in if login and/or password is invalid or empty
        When I log in as an <user> user with <loginState> login and <passwordState> password
        Then I see that login is <loginState> and password is <passwordState>
        Then I am not logged in

        Examples:
            | user               | loginState     | passwordState |
            | 'existing admin'   | 'empty'        | 'empty'       |
            | 'existing admin'   | 'not existing' | 'empty'       |
            | 'existing admin'   | 'not existing' | 'invalid'     |
            | 'existing admin'   | 'not existing' | 'valid'       |
            | 'existing admin'   | 'invalid'      | 'invalid'     |
            | 'existing admin'   | 'invalid'      | 'empty'       |
            | 'existing admin'   | 'invalid'      | 'valid'       |
            | 'existing admin'   | 'empty'        | 'invalid'     |
            | 'existing admin'   | 'empty'        | 'valid'       |
            | 'existing admin'   | 'valid'        | 'invalid'     |
            | 'existing admin'   | 'valid'        | 'empty'       |
            | 'existing editor'  | 'not existing' | 'invalid'     |
            | 'existing editor'  | 'not existing' | 'valid'       |
            | 'existing editor'  | 'not existing' | 'empty'       |
            | 'existing editor'  | 'invalid'      | 'invalid'     |
            | 'existing editor'  | 'invalid'      | 'empty'       |
            | 'existing editor'  | 'invalid'      | 'valid'       |
            | 'existing editor'  | 'empty'        | 'invalid'     |
            | 'existing editor'  | 'empty'        | 'empty'       |
            | 'existing editor'  | 'empty'        | 'valid'       |
            | 'existing editor'  | 'valid'        | 'invalid'     |
            | 'existing editor'  | 'valid'        | 'empty'       |

