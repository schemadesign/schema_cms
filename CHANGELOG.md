## [Unreleased]

### Fixes

### Changes
- add api url from the backend on the project view and projects list

### Features


## 1.9.3 (October 22, 2020) - Fixes
#### Fixes
- handle observable element during import/export
- django admin fix for pages details view


## 1.9.2 (October 22, 2020) - Fixes
#### Changes
- timeout for django admin increased


## 1.9.1 (October 19, 2020) - Fixes
#### Fixes
- pages custom elements import/export fixes


## 1.9.0 (October 13, 2020) - Release
#### Fixes
- Google Sheets validation, uploading and toggling between CSV

### Features
- import/export project functionality

## 1.8.1 (October 02, 2020) - Fixes

### Fixes
- First time login via Google
- Google Sheets uploading
- Google Sheets scripts running
- Result and sources files download

### Features
- Google Sheets reimport button

## 1.8.0 (September 28, 2020) - Release

### Fixes
- Editor was able to see unavailable templates
- Tags ordering in datasource 

### Features
- Okta authentication backend added
- List of draft pages in projects endpoint added

## 1.7.4 (September 17, 2020) - Hotfix

### Fixes

- Support to AWS CLI version 1 and 2
- PublicApi endpoints error when owner or created_by fields are empty
- Removing page template cosing pages removal

## 1.7.3 (September 11, 2020) - Hotfix

### Changes

- Migrations merging

## 1.7.2 (September 10, 2020) - Hotfix

### Changes

- Remove signature for public S3 files
- Revoke is_rss_content for soft-deleted Section & generate new RSS feed when deleted

## 1.7.1 (September 10, 2020) - Hotfix

### Fixes

- Added possibility to change page author in Django Admin panel
- Allow empty relation for template and section

### Changes

### Features

## 1.7.0 (September 02, 2020) - Release

### Fixes
- Bump dependencies versions and fix mocking of redux-sagas/effects
- Changed redirecting user after reverting to the original file with data source
- Prompt user when leave route with unsaved changes
- Added number of tags to the data source tile
- Fixed snapshot test for number of tags
- Warnings during building local docker images
- Fix the case when user is leaving the edit page in order to add block and back

### Changes
- README.md and documentation update
- Allow to select section which pages will be displayed in RSS xml file
- Add switch button to set section to be available in RSS feed

Fix the case when user is leaving the edit page in order to add block and back

## 1.6.0 (August 26, 2020) - Release

Added:
    
- state of the page to the page name
- frontend link field in pages form
- RSS feature to the project endpoint, so now we generate RSS XML on project level and upload in S3
- proper icons and usage of Storage in the extension
- google sheets as data source

Changed:
 - 'Save' to 'Save draft' text button on the page form

Automation tests:
 - changed the approach from object-oriented to functional
 - added a README.md
 - updated the configuration, so it is easier to run tests on various browsers and environments
 - added support for Gmail API


Chrome extension:
- clean up and proper URL for fetching page drafts in the example added


## 1.5.4 (August 12, 2020) - Fixes

Fix an issue with deleting pages

## 1.5.3 (August 11, 2020) - Fixes

Fix rendering of accordions details, and fix collapsing button display

## 1.5.2 (August 11, 2020) - Hotfix

Fix an issue where copying a page creates only a draft
Invitation email subject changed

## 1.5.1 (August 10, 2020) - Hotfix

Fix an issue preventing to fetch pages with IN condition from public API

## 1.5.0 (August 10, 2020) - First Release

### Backend & Frontend

- process of datasources
- creation of content (pages, articles, templates and states)
- data manipulation - upload of python scripts
- Auth0 login and users management

### Infrastructure

- creation of the cloud formation 
- creation of the APIs and necessary services

### Chrome Extension

- Chrome extension to fetch Schema CMS preview pages


### Schema UI

- Schema custom components library
