import { When, Then } from 'cucumber';
import Tabs from '../pages/Components/Tabs/tabs.component';
import Homepage from '../pages/Homepage/homepage.page';
import ProjectSettings from '../pages/ProjectSettings/projectSettings.page';
import TopHeader from '../pages/Components/TopHeader/topHeader.component';
import { clickElement } from '../helpers/actions';


When('I cho(o)se to see project settings', () => {
  Homepage.tileCreationDate = Homepage.projectCreationDate().getText();
  Homepage.tileStatus = Homepage.projectStatus().getText();
  Homepage.tileOwner = Homepage.projectOwner().getText();
  Homepage.tileTitle = Homepage.projectTitle().getText();
  Homepage.tileDescription = Homepage.projectDescription().getText();
  Homepage.tileApiPath = Homepage.projectApiPath().getText();
  clickElement(Homepage.projectTitle());
});

Then('I can see the project settings page with all its content', () => {
  ProjectSettings.expectProjectSettingsPageToMatchDesign();
  expect(TopHeader.projectName()).toHaveText(Homepage.tileTitle);
});

Then('project settings match the data on the tile', () => {
  const projectTileValues = [
    Homepage.tileCreationDate,
    Homepage.tileStatus,
    Homepage.tileOwner,
    Homepage.tileTitle,
    Homepage.tileDescription,
    Homepage.tileApiPath,
  ];
  ProjectSettings.expectProjectTileToHaveProperData(projectTileValues);
});

