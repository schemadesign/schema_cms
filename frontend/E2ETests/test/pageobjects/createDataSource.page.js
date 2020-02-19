import path from 'path';
import Page from './page';
import SubHeaderComponent from './components/subHeader.component';
import { clickElement, setValue, waitForElement, waitForTitle } from '../utils/utils';
import {
  CREATE_DATASOURCE_PAGE_TITLE,
  CREATE_DATASOURCE_VALID_TITLE,
  CSV_FILE,
} from '../constants/createDatasource.constants';

class CreateDataSourcePage extends Page {
  get SubHeader() {
    return SubHeaderComponent;
  }

  get nameLabel() {
    return $('[for="name"]');
  }

  get nameValue() {
    return $('#name');
  }

  get csvIcon() {
    return $('[for="file"]');
  }

  get fileUploadInput() {
    return $('#fileUpload');
  }

  get csvUploadFileName() {
    return $$('[for="fileUpload"]')[0];
  }

  get csvUploadBtn() {
    return $$('[for="fileUpload"] > div > svg')[0];
  }

  get saveBtn() {
    return $('#createDataSourceSaveBtn');
  }

  get backBtn() {
    return $('#createDataSourceBackBtn');
  }

  uploadCsvFile(fileState) {
    waitForTitle(CREATE_DATASOURCE_PAGE_TITLE);
    clickElement(this, 'nameValue');
    setValue(this, 'nameValue', CREATE_DATASOURCE_VALID_TITLE);
    clickElement(this, 'csvIcon');
    this.makeFileInputVisible(this.fileUploadInput);
    waitForElement(this, 'fileUploadInput');
    this.passFileToInput(fileState);
    clickElement(this, 'saveBtn');
  }

  passFileToInput(fileState) {
    const filePath = path.join(__dirname, CSV_FILE[fileState]);
    this.fileUploadInput.setValue(filePath);
  }

  makeFileInputVisible(inputName) {
    browser.execute(inputName => {
      inputName.style.display = 'block';
      inputName.style.height = '50px';
      inputName.style.visibility = 'visible';
    }, inputName);
  }
}
export default new CreateDataSourcePage();
