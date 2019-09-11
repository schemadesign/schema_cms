import Page from './page.js';

class ProjectsPage extends Page {

    get menuBtn() { return $(''); }
    get addProjectBtn() { return $('#addProjectBtn'); }
    get creationDate() { return $(''); }
    get status() { return $(''); }
    get owner() { return $(''); }
    get title() { return $(''); }
    get description() { return $(''); }
    get apiPath() { return $(''); }


    waitForProjectsPageToLoad() {
        if(!this.addProjectBtn.isDisplayed()) {
            this.addProjectBtn.waitForDisplayed();
        }
    }
}
export default new ProjectsPage();