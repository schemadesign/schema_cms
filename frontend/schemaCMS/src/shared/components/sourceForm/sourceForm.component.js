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
  SOURCE_TYPE_GOOGLE_SPREADSHEET,
  DATA_SOURCE_LINK,
} from '../../../modules/dataSource/dataSource.constants';
import { Uploader } from '../form/uploader';
import { getEventFiles, isProcessingData } from '../../utils/helpers';

const { RadioGroup, RadioBaseComponent, Label } = Form;
const { CsvIcon } = Icons;

export class SourceFormComponent extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    intl: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    uploadingDataSources: PropTypes.array,
  };

  static defaultProps = {
    dataSource: {},
    uploadingDataSources: [],
  };

  static state = {
    googleLink: '',
  };

  handleUploadChange = (data, { setFieldValue }) => {
    const uploadFile = getEventFiles(data);
    if (!uploadFile.length) {
      return;
    }

    setFieldValue('file', uploadFile[0]);
    setFieldValue('fileName', pathOr('', ['name'], uploadFile[0]));
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

  renderGoogleUploader = ({ setFieldValue, fileName, disabled, ...restProps }) => {
    const { handleChange } = this.props;
    return (
      <TextInput
        value={name || ''}
        onChange={handleChange}
        name={DATA_SOURCE_LINK}
        fullWidth
        checkOnlyErrors
        label={this.props.intl.formatMessage(messages.name)}
        isEdit
        {...restProps}
      />
    );
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
        equals(SOURCE_TYPE_GOOGLE_SPREADSHEET),
        () => (
          <Fragment>
            {this.renderGoogleUploader({
              ...restProps,
              disabled: isProcessing || fileUploading,
            })}
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

  renderGoogleButton = type => {
    const { active, unActive } = this.props.theme.radioButton;
    const { fill, background } = type === DATA_SOURCE_LINK ? active : unActive;

    return (
      <RadioBaseComponent
        label={this.props.intl.formatMessage(messages.googleSpreadSheet)}
        value={DATA_SOURCE_LINK}
        id={DATA_SOURCE_LINK}
      >
        <Button id="googleSpreadsheetUploadIcon" customStyles={{ background, ...buttonStyles }} type="button">
          <CsvIcon customStyles={{ fill }} />
        </Button>
      </RadioBaseComponent>
    );
  };

  render() {
    const { dataSource, handleChange, values, uploadingDataSources, ...restProps } = this.props;
    const { jobsState, id, metaData } = dataSource;
    const { isProcessing } = isProcessingData({ jobsState, metaData });
    const uploadingDataSource = find(propEq('id', id), uploadingDataSources);
    const { name, type } = values;
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
          {this.renderRadioButton(type)}
          {this.renderGoogleButton(type)}
        </RadioGroup>
        {this.renderSourceUpload({
          type,
          fileName,
          isProcessing: isProcessing && !!dataSource.fileName,
          fileUploadingError,
          fileUploading,
          ...restProps,
        })}
      </Fragment>
    );
  }
}

export const SourceForm = withTheme(SourceFormComponent);
