Feature: CMS-49-Admin

    As an Admin
    I want to see project settings
    so I can have a clear view of it

    Background: User is logged in
        Given I am on Login page
        And I have logged in as an 'existing admin' user with 'valid' login and 'valid' password
        And I am on 'homepage' page

    Scenario: User can see Project Settings page after clicking project tile
        When I choose to see project settings
        Then I am on 'project details' page
        And I can see the project settings page with all its content
        And project settings match the data on the tile

