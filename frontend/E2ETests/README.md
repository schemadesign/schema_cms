# Automation tests for Schema CMS

#### This project contains an automation tests for the web version of Schema CMS

## Requirements

* Node.js 12+
* npm 6+
* Java (latest)

## Installation
1. Clone this repository
1. Install all the necessary packages:

   `npm i`
    
## Usage
1. Create `credentials.js` file in the `./test/credentials` directory and provide required values - there is a sample file inside
1. Enable Gmail API for email account of your preference by clicking `Enable the Gmail API` button at https://developers.google.com/gmail/api/quickstart/nodejs
    * after API is enabled there will be a `credentials.json` file that must be downloaded and put inside the `test/Gmail API` directory
    * `credentials.json` file should be rewritten to become a `gmail.api.credentials.js` - there is a sample file inside
 
1. Navigate to `./test/GmailAPI` directory and create a token for Gmail API which is needed for getting activation email:

    `npx babel-node --trace-deprecation --presets '@babel/preset-env' index.js`

1. Tests can be run on different environments and different browsers, all the scripts are available in `package.json` file.

    Example: to run the tests on `stage` environment on `Chrome` browser using `Puppeteer` run the following:

    `npm run stage:chr:pup`
1. To run a specific feature file just add its name after the main command, for example:

    `npm run stage:chr:pup CMS-7.feature`   
1. To run a tagged scenario simply add its name after the main command:
    
    `npm run stage:chr:pup -- --cucumberOpts.tagExpression='@tagname'`
1. To run the tests in debug mode simply add `DEBUG=true` at the beginning of a command:

    `DEBUG=true npm run stage:chr:pup`

1. To specify after how many failed tests the execution should stop, simply add `BAIL=number`, for example to stop the execution of tests after 3 failed tests, simply run the following command:
    
    `BAIL=3 npm run stage:chr:pup`
1. Generate a report for tests:

    `npm run generate-report`

