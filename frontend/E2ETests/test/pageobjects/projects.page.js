import Page from './page';
import TopHeaderComponent from './components/topHeader.component';
import MenuComponent from './components/menu.component';
import { clickElement } from '../utils/utils';

class ProjectsPage extends Page {
  super() {
    this._projectName = '';
  }

  get projectName() {
    return this._projectName;
  }

  set projectName(projectName) {
    this._projectName = projectName;
  }

  get TopHeader() {
    return TopHeaderComponent;
  }

  get Menu() {
    return MenuComponent;
  }

  get addProjectBtn() {
    return $('#addProjectDesktopBtn');
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
    clickElement(this, 'projectTitle');
  }
}
export default new ProjectsPage();
