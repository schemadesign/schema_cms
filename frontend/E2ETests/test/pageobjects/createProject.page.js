import Page from './page.js';

class CreateProjectPage extends Page {

    get menuBtn() { return $(''); }
    get titleInput() { return $(''); }
    get descriptionInput() { return $(''); }
    get apiInput() { return $(''); }
    get statusInput() { return $(''); }
    get ownerInput() { return $(''); }
    get emailInput() { return $(''); }
    get finishBtn() { return $(''); }


    waitForCreateProjectPageToLoad() {
        if(!this.finishBtn.isDisplayed()) {
            this.finishBtn.waitForDisplayed(5000);
        }
    }
}
export default new CreateProjectPage();