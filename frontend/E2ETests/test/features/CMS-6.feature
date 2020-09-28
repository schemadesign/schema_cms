Feature: CMS-6

    As an Admin
    I want to update my first user account in Schema CMS
    so that I can start working on the client project

    Background: User is logged in admin panel
        Given Super Admin is logged in admin panel


    Scenario: User invited from Django admin panel can log into SchemaCMS
        Given Super Admin invited me to Schema CMS as an 'invited admin'
        And Super Admin can see confirmation that I was added as an 'admin'
        And I appear in the list of users as an 'admin'
        And my user status as an 'admin' is set to 'inactive'
        And I received an email with the invitation link
        When I set new password as an 'invited admin'
        Then I can log in to Schema CMS
        And my user status as an 'admin' is set to 'active'


    Scenario: Inviting already existing user in admin panel shouldn't be possible
        When Super Admin invite me to Schema CMS as an 'existing admin'
        Then I can see message that 'existing admin' with this email already exists



