Feature: CMS-6

    As an Admin 
    I want to update my first user account in Schema CMS 
    so that I can start working on the client project

    Scenario: User invited by Admin appears in list of users
        Given I am logged in admin panel
        When I invite John Doe to SchemaCMS
        Then I can see confirmation that user was added
        And John Doe appears in the list of Users
        And John Doe status is set to inactive 
        
    Scenario: Inviting already existing user in admin panel shouldn't be possible
        Given I am logged in admin panel
        When I invite John Doe to SchemaCMS
        Then I can see message that user with this email already exists

    Scenario: After accepting invitation and changing password, user status is set to active
        #Given Admin invited John Doe
        #And John Doe received an invitation email 
        #When John Doe uses an invitation email
        Then John Doe status is set to active in admin panel

        