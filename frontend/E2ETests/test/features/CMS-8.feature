Feature: CMS-8

    As a user
    I want to recover my password 
    so that I can log in after I forget it

    Background: User is on login page
        Given I am on Login page
        
    
    Scenario: User receives a link for resetting password if provided email is valid
        When I provide valid email to recover my password
        Then I am informed that reset link was sent to me
        And I receive an email with the reset link
    
    Scenario: User can reset a password if provided passwords match
        Given I provided valid email to recover my password
        And I used reset link sent to me
        And I am on page for creating new password
        When I provide matching passwords
        Then I am informed that my new password is created
        And I am not able to log in using old password
        And I am able to log in using new password
    
    Scenario: User doesn't receive a link for resetting password if provided email is invalid
        When I provide invalid email to recover my password
        Then I am informed that reset link was sent to me
        And I don't receive an email with the reset link 

    Scenario: User cannot reset a password if provided passwords don't match
        Given I provided valid email to recover my password
        And I used reset link sent to me
        And I am on page for creating new password
        When I provide passwords that don't match
        Then I am informed that my new password wasn't created
        And the new password is not created
    