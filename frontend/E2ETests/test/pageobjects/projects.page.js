import Page from './page.js';
const TIMEOUT = 10000;

class ProjectsPage extends Page {

    get menuBtn() { return $(''); }
    get addProjectBtn() { return $('#addProjectBtn'); }
    get creationDate() { return $(''); }
    get status() { return $(''); }
    get owner() { return $(''); }
    get title() { return $(''); }
    get description() { return $(''); }
    get apiPath() { return $(''); }


    waitForElement(name, timeout = TIMEOUT) {
        browser.waitUntil(() => this[name].isDisplayed(),timeout, `${name} not load after 10 seconds`);
    }
}
export default new ProjectsPage();