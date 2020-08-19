import path from 'path';
import PAGE_TITLE from '../../Constants/pageTitle.constants';
import { CSV_FILE } from "./createDatasource.constants";
import { createSelectors, makeFileInputVisible } from '../../../helpers/utils';
import { waitForElement, waitForTitle } from '../../../helpers/waitFor';
import { clickElement, setValue } from '../../../helpers/actions';

const singleSelectors = {
  nameLabel: '[for="name"]',
  nameValue: '#name',
  csvIcon: '[for="file"]',
  fileUploadInput: '#fileUpload',
  saveBtn: '#createDataSourceSaveBtn',
  backBtn: '#createDataSourceBackBtn',
};

const multiSelectors = {
  fileUploadName: '[for="fileUpload"]',
  fileUploadBtn: '[for="fileUpload"] > div > svg',
};

const passFileToInput = CreateDataSource => fileState => {
  const filePath = path.join(__dirname, CSV_FILE[fileState]);
  setValue(CreateDataSource.fileUploadInput(), filePath);
};

const uploadCsvFile = CreateDataSource => (datasetName, fileState) => {
  waitForTitle(PAGE_TITLE.createDataSource);
  clickElement(CreateDataSource.nameValue());
  setValue(CreateDataSource.nameValue(), datasetName);
  clickElement(CreateDataSource.csvIcon());
  makeFileInputVisible(CreateDataSource.fileUploadInput());
  waitForElement(CreateDataSource.fileUploadInput());
  passFileToInput(CreateDataSource)(fileState);
  clickElement(CreateDataSource.saveBtn());
};

const getFunctions = CreateDataSource => ({
  passFileToInput: passFileToInput(CreateDataSource),
  uploadCsvFile: uploadCsvFile(CreateDataSource),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
