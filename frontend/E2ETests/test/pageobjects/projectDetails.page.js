import Page from './page.js';
import { waitForElement } from '../utils/utils';
import HeaderComponent from './../pageobjects/components/header.component.js';
import MenuComponent from './../pageobjects/components/menu.component.js';

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
    }
}
export default new ProjectDetailsPage();