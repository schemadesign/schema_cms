import Page from './page.js';

class ProjectsPage extends Page {

    get menuBtn() { return $(''); }
    get createProjectBtn() { return $(''); }
    get creationDate() { return $(''); }
    get status() { return $(''); }
    get owner() { return $(''); }
    get title() { return $(''); }
    get description() { return $(''); }
    get apiPath() { return $(''); }


    waitForProjectsPageToLoad() {
        if(!this.createProjectBtn.isDisplayed()) {
            this.createProjectBtn.waitForDisplayed(5000);
        }
    }
}
export default new ProjectsPage();