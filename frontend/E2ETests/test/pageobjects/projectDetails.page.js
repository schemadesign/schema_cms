import Page from './page';
import ProjectsPage from './projects.page';
import { clickElement } from '../utils/utils';
import TopHeaderComponent from './components/topHeader.component';
import MenuComponent from './components/menu.component';
import TabsComponent from './components/tabs.component';
import { CREATE_PROJECT_VALID_TITLE } from '../constants/createProject.constants';

class ProjectDetailsPage extends Page {
  get TopHeader() {
    return TopHeaderComponent;
  }

  get Menu() {
    return MenuComponent;
  }

  get Tabs() {
    return TabsComponent;
  }

  get dataSourcesTile() {
    return $('#projectDataSources');
  }

  get dataSourcesTileLabel() {
    return $('#projectDataSources span');
  }

  get dataSourcesTileAmount() {
    return $('#projectDataSourcesValue');
  }

  get usersTile() {
    return $('#projectUsers');
  }

  get usersTileLabel() {
    return $('#projectUsers span');
  }

  get usersTileAmount() {
    return $('#projectUsersValue');
  }

  get chartsTile() {
    return $('#projectCharts');
  }

  get chartsTileLabel() {
    return $('#projectCharts span');
  }

  get chartsTileAmount() {
    return $('#projectChartsValue');
  }

  get pagesTile() {
    return $('#projectPages');
  }

  get pagesTileLabel() {
    return $('#projectPages span');
  }

  get pagesTileAmount() {
    return $('#projectPagesValue');
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
    return $('#backProjectBtn');
  }

  get deleteProjectBtn() {
    return $('#deleteProjectDesktopBtn');
  }

  get projectRemovalConfirmationModal() {
    return $('#projectConfirmationRemovalModal');
  }

  get projectRemovalConfirmationModalTitle() {
    return $('#projectConfirmationRemovalModalTitle');
  }

  get confirmRemovalProjectBtn() {
    return $('#projectConfirmationRemovalModalConfirmBtn');
  }

  get cancelRemovalProjectBtn() {
    return $('#projectConfirmationRemovalModalCancelBtn');
  }

  openMenu() {
    clickElement(this, 'TopHeader.menuBtn');
  }

  deleteProject() {
    clickElement(this, 'deleteProjectBtn');
    clickElement(this, 'confirmRemovalProjectBtn');

    expect(ProjectsPage.projectTitle.getText()).to.not.equal(
      CREATE_PROJECT_VALID_TITLE
    );
  }
}
export default new ProjectDetailsPage();
