Feature: CMS-6

    As an Admin
    I want to update my first user account in Schema CMS
    so that I can start working on the client project

    Background: User is logged in admin panel
        Given django admin is logged in admin panel


    Scenario: User invited from Django admin panel can log into SchemaCMS
        Given 'django' admin invites me to Schema CMS as an 'invited admin'
        And django admin can see confirmation that I was added as an 'admin'
        And I appear in the list of users as an 'admin'
        And my user status as an 'admin' is set to 'inactive'
        And I received an email with the invitation link
        When I set new password as an 'invited admin'
        Then I can log in to Schema CMS as an 'admin' 'invited' from 'django'
        And my user status as an 'admin' is set to 'active'


    Scenario: Inviting already existing user in admin panel shouldn't be possible
        When 'django' admin invites me to Schema CMS as an 'existing admin'
        Then Admin can see a message in 'django' that 'existing admin' with this email already exists



