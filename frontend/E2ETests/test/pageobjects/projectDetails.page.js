import Page from './page.js';
import ProjectsPage from './projects.page.js';
import { waitForElement } from '../utils/utils';
import HeaderComponent from './../pageobjects/components/header.component.js';
import MenuComponent from './../pageobjects/components/menu.component.js';
import { CREATE_PROJECT_VALID_TITLE } from './../constants/createProject.constants.js';


class ProjectDetailsPage extends Page {

    get Header() { return HeaderComponent; }
    get Menu() { return MenuComponent; }

    get dataSourcesTile() { return $('#projectDataSources'); }
    get dataSourcesLabel() { return $('div=Data Sources'); }
    get dataSourcesAmount() { return $('#projectDataSourcesValue'); }
    get usersTile() { return $('#projectUsers'); }
    get usersLabel() { return $('div=Users'); }
    get usersAmount() { return $('#projectUsersValue'); }
    get lastUpdateLabel() { return $('#fieldLastUpdatedLabel'); }
    get lastUpdateValue() { return $('#fieldLastUpdatedValue'); }
    get statusLabel() { return $('#fieldStatusLabel'); }
    get statusValue() { return $('#fieldStatusValue'); }
    get ownerLabel() { return $('#fieldOwnerLabel'); }
    get ownerValue() { return $('#fieldOwnerValue'); }
    get titleLabel() { return $('#fieldTitleLabel'); }
    get titleValue() { return $('#fieldTitleValue'); }
    get descriptionLabel() { return $('#fieldDescriptionLabel'); }
    get descriptionValue() { return $('#fieldDescriptionValue'); }
    get apiPathLabel() { return $('#fieldSlugLabel'); }
    get apiPathValue() { return $('#fieldSlugValue'); }
    get backBtn() { return $('#addProjectBtn'); }


    openMenu() {
        waitForElement(this.Header, 'menuBtn');
        this.Header.menuBtn.click();
    }

    deleteProject() {
        waitForElement(this.Menu, 'deleteProjectBtn');
        this.Menu.deleteProjectBtn.click();
        waitForElement(this.Menu, 'deletionConfirmationModal');
        this.Menu.confirmDeleteProjectBtn.click();

        expect(ProjectsPage.projectTitle.getText()).to.not.equal(CREATE_PROJECT_VALID_TITLE);
    }
}
export default new ProjectDetailsPage();