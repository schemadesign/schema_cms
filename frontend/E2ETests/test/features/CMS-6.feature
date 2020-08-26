Feature: CMS-6

    As an Admin
    I want to update my first user account in Schema CMS
    so that I can start working on the client project

    Background: User is logged in admin panel
        Given I am logged in admin panel


    Scenario: User invited from Django admin panel can log into SchemaCMS
        Given I have invited new user to SchemaCMS
        And I can see confirmation that user was added
        And invited user appears in the list of Users
        And invited user status is set to 'inactive'
        And invited user received an email with the invitation link
        When invited user sets new password
        Then invited user can log in to Schema CMS
        And invited user status is set to 'active'


    Scenario: Inviting already existing user in admin panel shouldn't be possible
        When I invite existing user to Schema CMS
        Then I can see message that user with this email already exists



