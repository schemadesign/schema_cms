import Page from './page.js';
import HeaderComponent from './components/header.component.js';
import { waitForElement, camelCase } from './../utils/utils.js';
import { CREATE_PROJECT_VALID_TITLE, CREATE_PROJECT_VALID_DESCRIPTION } from './../constants/createProject.constants.js';


class CreateProjectPage extends Page {

    get Header() { return $(HeaderComponent); }

    get titleInput() { return $('#title'); }
    get titleLabel() { return $('[for="title"]'); }
    get descriptionInput() { return $('#description'); }
    get descriptionLabel() { return $('[for="description"]'); }
    get statusDropdown() { return $('#app > div > div > div > form > div.sc-jlyJG.jsmwSn > div > div > div:nth-child(1)'); }
    get statusLabel() { return $('#app > div > div > div > form > div.sc-jlyJG.jsmwSn > label'); }
    get ownerInput() { return $('#owner'); }
    get ownerLabel() { return $('[for="owner"]'); }
    get cancelBtn() { return $('#app > div > div > div > form > div.sc-kpOJdX.kzMrFZ > div > button:nth-child(1)'); }
    get finishBtn() { return $('#app > div > div > div > form > div.sc-kpOJdX.kzMrFZ > div > button:nth-child(2)'); }
    get listOfStatus() { return $('#app > div > div > div > form > div.sc-jlyJG.jsmwSn > div > div > div:nth-child(2)'); }
    get inProgress() { return $('#select-item-0'); }
    get done() { return $('#select-item-1'); }
    get hold() { return $('#select-item-2'); }
    get published() { return $('#select-item-3'); }
    get titleErrorMsg() { return $(''); }
    get descriptionErrorMsg() { return $(''); }



    selectStatus(status) {
        waitForElement(this, 'statusDropdown');
        this.statusDropdown.click();
        waitForElement(this, 'listOfStatus');
        this[camelCase(status)].click();
    }

    completeRequiredFields() {
        waitForElement(this, 'titleInput');
        this.titleInput.setValue(CREATE_PROJECT_VALID_TITLE);
        waitForElement(this, 'descriptionInput');
        this.descriptionInput.setValue(CREATE_PROJECT_VALID_DESCRIPTION);
    }
}
export default new CreateProjectPage();