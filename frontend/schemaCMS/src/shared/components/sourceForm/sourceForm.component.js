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
  SpreadsheetReimport,
  SpreadsheetInput,
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
} from '../../../modules/dataSource/dataSource.constants';
import { Uploader } from '../form/uploader';
import { getEventFiles, isProcessingData } from '../../utils/helpers';
import { renderWhenTrue } from '../../utils/rendering';
import { BackButton, NextButton } from '../navigation';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';

const { RadioGroup, RadioBaseComponent, Label } = Form;
const { CsvIcon, GoogleSpreadsheetIcon } = Icons;

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
  };

  static defaultProps = {
    dataSource: {},
    uploadingDataSources: [],
  };

  state = {
    confirmationRunReimport: false,
  };

  handleUploadChange = (data, { setFieldValue }) => {
    const uploadFile = getEventFiles(data);
    if (!uploadFile.length) {
      return;
    }

    setFieldValue('file', uploadFile[0]);
    setFieldValue('fileName', pathOr('', ['name'], uploadFile[0]));
  };

  handleReimport = () => {
    this.setState({ confirmationRunReimport: false });
    this.props.setFieldValue(DATA_SOURCE_RUN_LAST_JOB, true);
    this.props.setFieldValue(DATA_SOURCE_REIMPORT, true);

    setTimeout(() => {
      this.props.handleSubmit();
    });
  };
  //
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
        checkOnlyErrors
        label={this.props.intl.formatMessage(messages.name)}
        isEdit
        {...restProps}
      />
    );
  };

  renderReimportButton = ({ isProcessing }) => {
    const { isSubmitting, dataSource } = this.props;

    return renderWhenTrue(
      always(
        <NextButton type="button" onClick={this.handleShowReimportModal} disabled={isSubmitting || isProcessing}>
          <FormattedMessage {...messages.reimport} />
        </NextButton>
      )
    )(!!dataSource[DATA_SOURCE_GOOGLE_SHEET]);
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
      [equals(SOURCE_TYPE_API), () => {}],
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
              <SpreadsheetReimport>{this.renderReimportButton({ isProcessing })}</SpreadsheetReimport>
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

  render() {
    const { dataSource, handleChange, values, uploadingDataSources, ...restProps } = this.props;
    const { confirmationRunReimport } = this.state;
    const { jobsState, id, metaData } = dataSource;
    const { isProcessing } = isProcessingData({ jobsState, metaData });
    const uploadingDataSource = find(propEq('id', id), uploadingDataSources);
    const { name, type, googleSheet } = values;
    const fileUploadingError = !!propOr(false, 'error', uploadingDataSource);
    const fileUploading = !!uploadingDataSource && !fileUploadingError;
    const fileName = ifElse(isNil, () => pathOr('', ['fileName'], values), prop('fileName'))(uploadingDataSource);

    return (
      <Fragment>
        <TextInput
          value={name || ''}
          onChange={handleChange}
          name={DATA_SOURCE_NAME}
          fullWidth
          checkOnlyErrors
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
          onChange={handleChange}
        >
          <SourceButtonWrapper>{this.renderRadioButton(type)}</SourceButtonWrapper>
          <SourceButtonWrapper>{this.renderSpreadsheetButton(type)}</SourceButtonWrapper>
        </RadioGroup>
        {this.renderSourceUpload({
          type,
          fileName,
          googleSheet,
          isProcessing: isProcessing && (!!dataSource.fileName || !!dataSource[DATA_SOURCE_GOOGLE_SHEET]),
          fileUploadingError,
          fileUploading,
          ...restProps,
        })}
        <Modal isOpen={confirmationRunReimport} contentLabel="Confirm Run Last Job" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.reimportTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton
              id="declineRunLastJob"
              type="button"
              onClick={() => this.setState({ confirmationRunReimport: false })}
            >
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
