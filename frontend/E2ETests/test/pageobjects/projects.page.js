import Page from './page';
import TopHeaderComponent from './components/topHeader.component';
import MenuComponent from './components/menu.component';
import { waitForElement } from '../utils/utils';

class ProjectsPage extends Page {
  get TopHeader() {
    return TopHeaderComponent;
  }

  get Menu() {
    return MenuComponent;
  }

  get addProjectBtn() {
    return $('#addProjectBtn');
  }

  get creationDate() {
    return $('#headerItem-0');
  }

  get status() {
    return $('#headerItem-1');
  }

  get owner() {
    return $('#headerItem-2');
  }

  get projectTitle() {
    return $('#projectName-0');
  }

  get projectDesc() {
    return $('#projectDescription-0');
  }

  get apiPath() {
    return $('#apiPath-0');
  }

  chooseFirstProject() {
    waitForElement(this, 'projectTitle');
    this.projectTitle.click();
  }
}
export default new ProjectsPage();
