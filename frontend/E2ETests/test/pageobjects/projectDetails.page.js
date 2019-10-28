import Page from './page.js';
import ProjectsPage from './projects.page.js';
import { waitForElement } from '../utils/utils';
import HeaderComponent from './../pageobjects/components/header.component.js';
import MenuComponent from './../pageobjects/components/menu.component.js';
import { CREATE_PROJECT_VALID_TITLE } from './../constants/createProject.constants.js';


class ProjectDetailsPage extends Page {

    get Header() { return HeaderComponent; }
    get Menu() { return MenuComponent; }

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