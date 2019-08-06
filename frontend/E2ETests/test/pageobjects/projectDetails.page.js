import Page from './page.js';

class ProjectDetailsPage extends Page {

    get menuBtn() { return $(''); }
    get headerTitle() { return $(''); }
    get datasources() { return $(''); }
    get chart() { return $(''); }
    get pages() { return $(''); }
    get users() { return $(''); }
    get lastUpdate() { return $(''); }
    get status() { return $(''); }
    get owner() { return $(''); }
    get title() { return $(''); }
    get description() { return $(''); }
    get apiPath() { return $(''); }


    waitForCreateProjectPageToLoad() {
        if(!this.finishBtn.isDisplayed()) {
            this.finishBtn.waitForDisplayed(5000);
        }
    }
}
export default new ProjectDetailsPage();