import Page from './page.js';
import HeaderComponent from './../pageobjects/components/header.component.js';
import MenuComponent from './../pageobjects/components/menu.component.js';
import { waitForElement } from '../utils/utils';


class ProjectsPage extends Page {
    get Header() { return HeaderComponent; }
    get Menu() { return MenuComponent; }

    get addProjectBtn() { return $('#addProjectBtn'); }
    get creationDate() { return $('#headerItem-0'); }
    get status() { return $('#headerItem-1'); }
    get owner() { return $('#headerItem-2'); }
    get projectTitle() { return $('#projectName-0'); }
    get projectDesc() { return $('#projectDescription-0'); }
    get apiPath() { return $('#apiPath-0'); }

    chooseFirstProject() {
        waitForElement(this, 'projectTitle');
        this.projectTitle.click();
    }
}
export default new ProjectsPage();