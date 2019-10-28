import Page from './page.js';
import HeaderComponent from './components/header.component.js';
import { waitForElement, camelCase } from './../utils/utils.js';
import { CREATE_PROJECT_VALID_TITLE, CREATE_PROJECT_VALID_DESCRIPTION } from './../constants/createProject.constants.js';


class CreateProjectPage extends Page {

    get Header() { return HeaderComponent; }

    get titleInput() { return $('#title'); }
    get titleLabel() { return $('[for="title"]'); }
    get descriptionInput() { return $('#description'); }
    get descriptionLabel() { return $('[for="description"]'); }
    get statusDropdown() { return $('#fieldProjectStatus'); }
    get statusLabel() { return $('#fieldProjectStatusLabel'); }
    get ownerInput() { return $('#owner'); }
    get ownerLabel() { return $('[for="owner"]'); }
    get cancelBtn() { return $('#cancelBtn'); }
    get finishBtn() { return $('#finishBtn'); }
    get listOfStatus() { return $('#fieldProjectStatus > div:nth-child(2)'); }
    get inProgress() { return $('#select-item-0'); }
    get done() { return $('#select-item-1'); }
    get hold() { return $('#select-item-2'); }
    get published() { return $('#select-item-3'); }
    get titleErrorMsg() { return $('form > div:nth-child(1) > div:nth-child(2)'); }
    get descriptionErrorMsg() { return $('form > div:nth-child(2) > div:nth-child(2)'); }



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