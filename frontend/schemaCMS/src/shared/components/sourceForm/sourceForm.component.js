import React, { Fragment, PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, cond, equals, pathOr, T } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withTheme } from 'styled-components';

import {
  buttonStyles,
  customLabelStyles,
  customRadioButtonStyles,
  customRadioGroupStyles,
  WarningWrapper,
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
} from '../../../modules/dataSource/dataSource.constants';
import { Uploader } from '../form/uploader';
import { renderWhenTrue } from '../../utils/rendering';
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
  };

  static defaultProps = {
    dataSource: {},
  };

  handleUploadChange = (data, { setFieldValue }) => {
    const uploadFile = getEventFiles(data);
    setFieldValue('file', uploadFile[0]);
    setFieldValue('fileName', pathOr('', ['name'], uploadFile[0]));
  };

  renderProcessingMessage = renderWhenTrue(
    always(
      <WarningWrapper>
        <FormattedMessage {...messages.processing} />
      </WarningWrapper>
    )
  );

  renderCsvUploader = ({ setFieldValue, fileName, jobsInProcess, ...restProps }) => (
    <Uploader
      fileNames={fileName}
      name={DATA_SOURCE_FILE}
      label={this.props.intl.formatMessage(messages.fileName)}
      placeholder={this.props.intl.formatMessage(messages.filePlaceholder)}
      type="file"
      id="fileUpload"
      onChange={data => this.handleUploadChange(data, { setFieldValue })}
      accept=".csv"
      disabled={jobsInProcess}
      checkOnlyErrors
      {...restProps}
    />
  );

  renderSourceUpload = ({ type, jobsInProcess, ...restProps }) =>
    cond([
      [
        equals(SOURCE_TYPE_FILE),
        () => (
          <Fragment>
            {this.renderCsvUploader({ ...restProps, jobsInProcess })}
            {this.renderProcessingMessage(jobsInProcess)}
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
    const { dataSource, handleChange, values, ...restProps } = this.props;
    const { name, fileName, type } = values;
    const { jobsInProcess } = dataSource;

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
        {this.renderSourceUpload({ type, fileName, jobsInProcess, ...restProps })}
      </Fragment>
    );
  }
}

export const SourceForm = withTheme(SourceFormComponent);
