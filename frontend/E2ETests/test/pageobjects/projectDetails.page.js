import Page from './page';
import ProjectsPage from './projects.page';
import { waitForElement } from '../utils/utils';
import TopHeaderComponent from './components/topHeader.component';
import MenuComponent from './components/menu.component';
import SubheaderComponent from './components/tabs.component';
import { CREATE_PROJECT_VALID_TITLE } from '../constants/createProject.constants';

class ProjectDetailsPage extends Page {
  get TopHeader() {
    return TopHeaderComponent;
  }

  get Menu() {
    return MenuComponent;
  }

  get Subheader() {
    return SubheaderComponent;
  }

  get dataSourcesTile() {
    return $('#projectDataSources');
  }

  get dataSourcesLabel() {
    return $('div=Data Sources');
  }

  get dataSourcesAmount() {
    return $('#projectDataSourcesValue');
  }

  get usersTile() {
    return $('#projectUsers');
  }

  get usersLabel() {
    return $('div=Users');
  }

  get usersAmount() {
    return $('#projectUsersValue');
  }

  get lastUpdateLabel() {
    return $('#fieldLastUpdatedLabel');
  }

  get lastUpdateValue() {
    return $('#fieldLastUpdatedValue');
  }

  get statusLabel() {
    return $('#fieldStatusLabel');
  }

  get statusValue() {
    return $('#fieldStatusValue');
  }

  get ownerLabel() {
    return $('#fieldOwnerLabel');
  }

  get ownerValue() {
    return $('#fieldOwnerValue');
  }

  get titleLabel() {
    return $('#fieldTitleLabel');
  }

  get titleValue() {
    return $('#fieldTitleValue');
  }

  get descriptionLabel() {
    return $('#fieldDescriptionLabel');
  }

  get descriptionValue() {
    return $('#fieldDescriptionValue');
  }

  get apiPathLabel() {
    return $('#fieldSlugLabel');
  }

  get apiPathValue() {
    return $('#fieldSlugValue');
  }

  get backBtn() {
    return $('#addProjectBtn');
  }

  get deleteProjectBtn() {
    return $('li=Delete Project');
  }

  get confirmDeleteProjectBtn() {
    return $('span=Confirm');
  }

  get deletionConfirmationModal() {
    return $('[aria-label="Confirm Removal"]');
  }

  openMenu() {
    waitForElement(this.TopHeader, 'menuBtn');
    this.Header.menuBtn.click();
  }

  deleteProject() {
    waitForElement(this.Menu, 'deleteProjectBtn');
    this.Menu.deleteProjectBtn.click();
    waitForElement(this.Menu, 'deletionConfirmationModal');
    this.Menu.confirmDeleteProjectBtn.click();

    expect(ProjectsPage.projectTitle.getText()).to.not.equal(
      CREATE_PROJECT_VALID_TITLE
    );
  }
}
export default new ProjectDetailsPage();
