Feature: CMS-280

  As an Admin
  I want to invite another user
  so they can use Schema CMS

  Background: user is logged in
    Given I am on Login page
    And I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
    And I am on 'homepage' page


  Scenario Outline: Admin can invite users with different roles
    Given 'Schema CMS' admin invites me to Schema CMS as an <combinedUser>
    And I received an email with the invitation link
    When I set new password as an <combinedUser>
    Then I can log in to Schema CMS as an <userRole> <userType> from 'Schema CMS'
    And my personal information as an <userRole> <userType> from 'Schema CMS' is displayed in the profile

    Examples:
      | userType  | userRole | combinedUser     |
      | 'invited' | 'admin'  | 'invited admin'  |
      | 'invited' | 'editor' | 'invited editor' |



  Scenario Outline: Admin cannot invite already existing user
    When 'Schema CMS' admin invites me to Schema CMS as an <userRole>
    Then Admin can see a message in 'Schema CMS' that <userRole> with this email already exists

    Examples:
      | userRole          |
      | 'existing admin'  |
      | 'existing editor' |


  Scenario Outline: Admin cannot invite a user if name, last name or email are empty
    When 'Schema CMS' admin leaves first name <firstNameState>, last name <lastNameState> and email <emailState>
    Then first name is <firstNameState>
    And last name is <lastNameState>
    And email is <emailState>
    And Invite button is inactive

      Examples:
        | firstNameState   | lastNameState | emailState |
        | 'empty'          | 'empty'       | 'empty'    |
        | 'empty'          | 'empty'       | 'invalid'  |
        | 'empty'          | 'too short'   | 'invalid'  |
        | 'empty'          | 'too short'   | 'empty'    |
        | 'too short'      | 'too short'   | 'empty'    |
        | 'too short'      | 'too short'   | 'invalid'  |
        | 'too short'      | 'empty'       | 'invalid'  |
        | 'too short'      | 'empty'       | 'empty'    |
