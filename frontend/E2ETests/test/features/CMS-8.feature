Feature: CMS-8

    As a user
    I want to recover my password
    so that I can log in after I forget it

    Background: User is on login page
        Given I am on Login page


    Scenario: User can reset a password if provided passwords match
        Given I have provided 'valid' email to recover my password
        And I used reset link sent to me
        And I am on 'reset password' page
        When I provide matching passwords
        Then I am informed that my new password is created
        And I am able to log in using 'reset' password

    @Test
    Scenario: User cannot reset a password if provided passwords don't match
        Given I provided 'valid' email to recover my password
        And I used reset link sent to me
        And I am on 'reset password' page
        When I provide passwords that don't match
        Then I am informed that my new password is not created
        And the new password is not created
