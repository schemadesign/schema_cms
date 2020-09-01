
## 1.9.0 (August 18, 2020) - Change

## [Unreleased]

### Fixes

- Bump dependencies versions and fix mocking of redux-sagas/effects
- Changed redirecting user after reverting to the original file with data source
- Prompt user when leave route with unsaved changes
- Added number of tags to the data source tile
- Fixed snapshot test for number of tags

### Changes

- README.md and documentation update

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
