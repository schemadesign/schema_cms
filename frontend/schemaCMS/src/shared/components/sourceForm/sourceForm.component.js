import React, { Fragment, PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, find, cond, equals, is, pathOr, propEq, T, ifElse, isNil, prop, propOr, either } from 'ramda';
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
  META_PENDING,
  META_PROCESSING,
  SOURCE_TYPE_API,
  SOURCE_TYPE_DATABASE,
  SOURCE_TYPE_FILE,
} from '../../../modules/dataSource/dataSource.constants';
import { Uploader } from '../form/uploader';
import { getEventFiles } from '../../utils/helpers';

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
      propEq('fileUploading', true),
      always(
        <WarningWrapper>
          <FormattedMessage {...messages.uploadingFile} />
        </WarningWrapper>
      ),
    ],
    [
      propEq('fileUploadingError', true),
      always(
        <ErrorWrapper>
          <FormattedMessage {...messages.uploadingError} />
        </ErrorWrapper>
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

  renderSourceUpload = ({ type, isProcessing, fileUploadingError, fileUploading, ...restProps }) =>
    cond([
      [
        equals(SOURCE_TYPE_FILE),
        () => (
          <Fragment>
            {this.renderCsvUploader({ ...restProps, disabled: (isProcessing && !fileUploadingError) || fileUploading })}
            {this.renderProcessingMessage({ isProcessing, fileUploadingError, fileUploading })}
          </Fragment>
        ),
      ],
      [equals(SOURCE_TYPE_API), () => {}],
      [equals(SOURCE_TYPE_DATABASE), () => {}],
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
        <Button customStyles={{ background, ...buttonStyles }} type="button">
          <CsvIcon customStyles={{ fill }} />
        </Button>
      </RadioBaseComponent>
    );
  };

  render() {
    const { dataSource, handleChange, values, uploadingDataSources, ...restProps } = this.props;
    const { jobsInProcess, id, metaData } = dataSource;
    const metaStatus = propOr('', 'status', metaData);
    const metaProcessing = either(equals(META_PENDING), equals(META_PROCESSING))(metaStatus);
    const isProcessing = metaProcessing || jobsInProcess;
    const uploadingDataSource = find(propEq('id', id), uploadingDataSources);
    const { name, type } = values;
    const fileUploadingError = !is(String, values.fileName);
    const fileUploading = uploadingDataSource && fileUploadingError;
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
        </RadioGroup>
        {this.renderSourceUpload({ type, fileName, isProcessing, fileUploadingError, fileUploading, ...restProps })}
      </Fragment>
    );
  }
}

export const SourceForm = withTheme(SourceFormComponent);
