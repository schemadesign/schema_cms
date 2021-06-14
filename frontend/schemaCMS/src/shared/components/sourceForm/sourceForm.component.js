import React, { Fragment, PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, find, cond, equals, pathOr, propEq, T, ifElse, isNil, prop, propOr } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withTheme } from 'styled-components';

import {
  buttonStyles,
  customLabelStyles,
  customRadioButtonStyles,
  customRadioGroupStyles,
  WarningWrapper,
  ErrorWrapper,
  SourceButtonWrapper,
  SpreadsheetContainer,
  SpreadsheetInput,
  ApiSourceContainer,
  ApiSourceInput,
  ApiSourceSwitch,
  ApiSourceUrlInputContainer,
  ReimportButtonContainer,
} from './sourceForm.styles';
import messages from './sourceForm.messages';
import { TextInput } from '../form/inputs/textInput';
import {
  DATA_SOURCE_FILE,
  DATA_SOURCE_NAME,
  DATA_SOURCE_TYPE,
  SOURCE_TYPE_API,
  SOURCE_TYPE_DATABASE,
  SOURCE_TYPE_FILE,
  SOURCE_TYPE_GOOGLE_SHEET,
  DATA_SOURCE_GOOGLE_SHEET,
  DATA_SOURCE_REIMPORT,
  DATA_SOURCE_RUN_LAST_JOB,
  DATA_SOURCE_FILE_NAME,
  DATA_SOURCE_API_URL,
  DATA_SOURCE_API_JSON_PATH,
  DATA_SOURCE_AUTO_REFRESH,
} from '../../../modules/dataSource/dataSource.constants';
import { Uploader } from '../form/uploader';
import { getEventFiles, isProcessingData } from '../../utils/helpers';
import { renderWhenTrue } from '../../utils/rendering';
import { BackButton, NextButton } from '../navigation';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';
import {
  AvailableCopy,
  SwitchContainer,
  SwitchContent,
  SwitchCopy,
  SwitchLabel,
} from '../form/frequentComponents.styles';

const { RadioGroup, RadioBaseComponent, Label, Switch } = Form;
const { CsvIcon, GoogleSpreadsheetIcon, ApiIcon } = Icons;

export class SourceFormComponent extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    intl: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    uploadingDataSources: PropTypes.array,
    isSubmitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    setFieldValue: PropTypes.func,
    validateForm: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
  };

  static defaultProps = {
    dataSource: {},
    uploadingDataSources: [],
  };

  state = {
    confirmationRunReimport: false,
  };

  handleTypeChange = event => {
    const { handleChange, setFieldValue, dataSource } = this.props;
    const type = event.target.value;

    handleChange(event);

    if (type === SOURCE_TYPE_FILE) {
      setFieldValue(DATA_SOURCE_GOOGLE_SHEET, dataSource[DATA_SOURCE_GOOGLE_SHEET] || '');
    }

    if (type === SOURCE_TYPE_GOOGLE_SHEET) {
      setFieldValue(
        DATA_SOURCE_FILE_NAME,
        (dataSource[DATA_SOURCE_TYPE] === SOURCE_TYPE_FILE && dataSource[DATA_SOURCE_FILE_NAME]) || null
      );
    }

    if (type === SOURCE_TYPE_API) {
      setFieldValue(
        DATA_SOURCE_FILE_NAME,
        (dataSource[DATA_SOURCE_TYPE] === SOURCE_TYPE_FILE && dataSource[DATA_SOURCE_FILE_NAME]) || null
      );
    }

    setTimeout(() => this.props.validateForm());
  };

  handleUploadChange = (data, { setFieldValue }) => {
    const uploadFile = getEventFiles(data);
    if (!uploadFile.length) {
      return;
    }

    setFieldValue(DATA_SOURCE_FILE, uploadFile[0]);
    setFieldValue(DATA_SOURCE_FILE_NAME, pathOr('', ['name'], uploadFile[0]));

    setTimeout(() => this.props.validateForm());
  };

  handleReimport = () => {
    this.setState({ confirmationRunReimport: false });
    this.props.setFieldValue(DATA_SOURCE_RUN_LAST_JOB, true);
    this.props.setFieldValue(DATA_SOURCE_REIMPORT, true);

    setTimeout(() => {
      this.props.handleSubmit();
    });
  };

  handleShowReimportModal = () => {
    this.setState({ confirmationRunReimport: true });
  };

  renderProcessingMessage = cond([
    [
      propEq('fileUploadingError', true),
      always(
        <ErrorWrapper>
          <FormattedMessage {...messages.uploadingError} />
        </ErrorWrapper>
      ),
    ],
    [
      propEq('fileUploading', true),
      always(
        <WarningWrapper>
          <FormattedMessage {...messages.uploadingFile} />
        </WarningWrapper>
      ),
    ],
    [
      propEq('isProcessing', true),
      always(
        <WarningWrapper>
          <FormattedMessage {...messages.processing} />
        </WarningWrapper>
      ),
    ],
    [T, always(null)],
  ]);

  renderCsvUploader = ({ setFieldValue, fileName, disabled, ...restProps }) => (
    <Uploader
      fileNames={fileName || ''}
      name={DATA_SOURCE_FILE}
      label={this.props.intl.formatMessage(messages.fileName)}
      placeholder={this.props.intl.formatMessage(messages.filePlaceholder)}
      type="file"
      id="fileUpload"
      onChange={data => this.handleUploadChange(data, { setFieldValue })}
      accept=".csv"
      disabled={disabled}
      checkOnlyErrors
      {...restProps}
    />
  );

  renderSpreadsheetInput = ({ googleSheet, ...restProps }) => {
    const { handleChange } = this.props;
    return (
      <TextInput
        value={googleSheet || ''}
        onChange={handleChange}
        name={DATA_SOURCE_GOOGLE_SHEET}
        placeholder={this.props.intl.formatMessage(messages.googleSpreadSheetPlaceholder)}
        fullWidth
        label={this.props.intl.formatMessage(messages.url)}
        isEdit
        {...restProps}
      />
    );
  };

  renderApiSourceUrlInput = ({ apiUrl, ...restProps }) => {
    const { handleChange } = this.props;
    return (
      <TextInput
        value={apiUrl || ''}
        onChange={handleChange}
        name={DATA_SOURCE_API_URL}
        placeholder={this.props.intl.formatMessage(messages.apiSourceUrlPlaceholder)}
        fullWidth
        label={this.props.intl.formatMessage(messages.url)}
        isEdit
        {...restProps}
      />
    );
  };

  renderApiSourceJsonPathInput = ({ apiJsonPath, ...restProps }) => {
    const { handleChange } = this.props;
    return (
      <TextInput
        value={apiJsonPath || ''}
        onChange={handleChange}
        name={DATA_SOURCE_API_JSON_PATH}
        placeholder={this.props.intl.formatMessage(messages.apiSourceJsonPathPlaceholder)}
        fullWidth
        label={this.props.intl.formatMessage(messages.apiSourceJsonPath)}
        isEdit
        {...restProps}
      />
    );
  };

  renderApiSourceAutoRefreshSwitch = ({ autoRefresh }) => {
    const { handleChange } = this.props;
    return (
      <SwitchContainer>
        <SwitchContent>
          <Switch value={autoRefresh} id={DATA_SOURCE_AUTO_REFRESH} onChange={handleChange} />
          <SwitchCopy>
            <SwitchLabel htmlFor={DATA_SOURCE_AUTO_REFRESH}>
              <FormattedMessage {...messages.apiSourceAutoRefreshLabel} />
            </SwitchLabel>
            <AvailableCopy>
              <FormattedMessage
                {...messages.apiSourceAutoRefreshCopy}
                values={{
                  autoRefreshState: this.props.intl.formatMessage(
                    messages[autoRefresh ? 'enabledAutoRefresh' : 'disabledAutoRefresh']
                  ),
                }}
              />
            </AvailableCopy>
          </SwitchCopy>
        </SwitchContent>
      </SwitchContainer>
    );
  };

  renderReimportButton = ({ isProcessing }) => {
    const { isSubmitting, dataSource, dirty } = this.props;

    return renderWhenTrue(
      always(
        <ReimportButtonContainer>
          <NextButton
            type="button"
            onClick={this.handleShowReimportModal}
            disabled={isSubmitting || isProcessing || dirty}
          >
            <FormattedMessage {...messages.reimport} />
          </NextButton>
        </ReimportButtonContainer>
      )
    )(!!dataSource[DATA_SOURCE_GOOGLE_SHEET] || !!dataSource[DATA_SOURCE_API_URL]);
  };

  renderSourceUpload = ({ type, isProcessing, fileUploadingError, fileUploading, ...restProps }) =>
    cond([
      [
        equals(SOURCE_TYPE_FILE),
        () => (
          <Fragment>
            {this.renderCsvUploader({
              ...restProps,
              disabled: isProcessing || fileUploading,
            })}
            {this.renderProcessingMessage({ isProcessing, fileUploadingError, fileUploading })}
          </Fragment>
        ),
      ],
      [
        equals(SOURCE_TYPE_API),
        () => (
          <Fragment>
            <ApiSourceContainer>
              <ApiSourceUrlInputContainer>
                <ApiSourceInput>
                  {this.renderApiSourceUrlInput({
                    ...restProps,
                    disabled: isProcessing || fileUploading,
                  })}
                </ApiSourceInput>
                {this.renderReimportButton({ isProcessing })}
              </ApiSourceUrlInputContainer>
              {this.renderProcessingMessage({ isProcessing, fileUploadingError, fileUploading })}
              <ApiSourceInput>
                {this.renderApiSourceJsonPathInput({
                  ...restProps,
                  disabled: isProcessing || fileUploading,
                })}
              </ApiSourceInput>
              <ApiSourceSwitch>{this.renderApiSourceAutoRefreshSwitch({ ...restProps })}</ApiSourceSwitch>
            </ApiSourceContainer>
          </Fragment>
        ),
      ],
      [equals(SOURCE_TYPE_DATABASE), () => {}],
      [
        equals(SOURCE_TYPE_GOOGLE_SHEET),
        () => (
          <Fragment>
            <SpreadsheetContainer>
              <SpreadsheetInput>
                {this.renderSpreadsheetInput({
                  ...restProps,
                  disabled: isProcessing || fileUploading,
                })}
              </SpreadsheetInput>
              {this.renderReimportButton({ isProcessing })}
            </SpreadsheetContainer>
            {this.renderProcessingMessage({ isProcessing, fileUploadingError, fileUploading })}
          </Fragment>
        ),
      ],
      [T, always(null)],
    ])(type);

  renderRadioButton = type => {
    const { active, unActive } = this.props.theme.radioButton;
    const { fill, background } = type === DATA_SOURCE_FILE ? active : unActive;

    return (
      <RadioBaseComponent
        label={this.props.intl.formatMessage(messages.csv)}
        value={DATA_SOURCE_FILE}
        id={DATA_SOURCE_FILE}
      >
        <Button id="csvUploadIcon" customStyles={{ background, ...buttonStyles }} type="button">
          <CsvIcon customStyles={{ fill }} />
        </Button>
      </RadioBaseComponent>
    );
  };

  renderSpreadsheetButton = type => {
    const { active, unActive } = this.props.theme.radioButton;
    const { fill, background } = type === SOURCE_TYPE_GOOGLE_SHEET ? active : unActive;

    return (
      <RadioBaseComponent
        label={this.props.intl.formatMessage(messages.googleSpreadSheet)}
        value={SOURCE_TYPE_GOOGLE_SHEET}
        id={SOURCE_TYPE_GOOGLE_SHEET}
      >
        <Button id="googleSpreadsheetUploadIcon" customStyles={{ background, ...buttonStyles }} type="button">
          <GoogleSpreadsheetIcon customStyles={{ fill }} />
        </Button>
      </RadioBaseComponent>
    );
  };

  renderApiSourceButton = type => {
    const { active, unActive } = this.props.theme.radioButton;
    const { fill, background } = type === SOURCE_TYPE_API ? active : unActive;

    return (
      <RadioBaseComponent
        label={this.props.intl.formatMessage(messages.apiSource)}
        value={SOURCE_TYPE_API}
        id={SOURCE_TYPE_API}
      >
        <Button id="apiSourceUploadIcon" customStyles={{ background, ...buttonStyles }} type="button">
          <ApiIcon customStyles={{ fill, width: '70px', height: '70px' }} />
        </Button>
      </RadioBaseComponent>
    );
  };

  render() {
    const { dataSource, handleChange, values, uploadingDataSources, ...restProps } = this.props;
    const { confirmationRunReimport } = this.state;
    const { jobsState, id, metaData } = dataSource;
    const { isProcessing } = isProcessingData({ jobsState, metaData });
    const uploadingDataSource = find(propEq('id', id), uploadingDataSources);
    const { name, type, googleSheet, apiUrl, apiJsonPath, autoRefresh } = values;
    const fileUploadingError = !!propOr(false, 'error', uploadingDataSource);
    const fileUploading = !!uploadingDataSource && !fileUploadingError;
    const fileName = ifElse(isNil, () => pathOr('', ['fileName'], values), prop('fileName'))(uploadingDataSource);
    const handleBackClick = () => this.setState({ confirmationRunReimport: false });

    return (
      <Fragment>
        <TextInput
          value={name || ''}
          onChange={handleChange}
          name={DATA_SOURCE_NAME}
          fullWidth
          label={this.props.intl.formatMessage(messages.name)}
          isEdit
          {...restProps}
        />

        <Label customStyles={customLabelStyles}>
          <FormattedMessage {...messages.source} />
        </Label>
        <RadioGroup
          name={DATA_SOURCE_TYPE}
          customStyles={customRadioGroupStyles}
          customLabelStyles={customRadioButtonStyles}
          value={type}
          onChange={this.handleTypeChange}
        >
          <SourceButtonWrapper>{this.renderRadioButton(type)}</SourceButtonWrapper>
          <SourceButtonWrapper>{this.renderSpreadsheetButton(type)}</SourceButtonWrapper>
          <SourceButtonWrapper>{this.renderApiSourceButton(type)}</SourceButtonWrapper>
        </RadioGroup>
        {this.renderSourceUpload({
          type,
          fileName,
          googleSheet,
          apiUrl,
          apiJsonPath,
          autoRefresh,
          isProcessing:
            isProcessing &&
            (!!dataSource.fileName || !!dataSource[DATA_SOURCE_GOOGLE_SHEET] || !!dataSource[DATA_SOURCE_API_URL]),
          fileUploadingError,
          fileUploading,
          ...restProps,
        })}
        <Modal isOpen={confirmationRunReimport} contentLabel="Confirm Run Last Job" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.reimportTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton id="declineRunLastJob" type="button" onClick={handleBackClick}>
              <FormattedMessage {...messages.cancelReimport} />
            </BackButton>
            <NextButton id="confirmRunLastJob" type="button" onClick={this.handleReimport}>
              <FormattedMessage {...messages.confirmReimport} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}

export const SourceForm = withTheme(SourceFormComponent);
