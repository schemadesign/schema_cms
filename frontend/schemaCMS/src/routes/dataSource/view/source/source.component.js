import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, cond, equals, omit, pathOr, T } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';

import {
  Container,
  customButtonStyles,
  customLabelStyles,
  customRadioButtonStyles,
  customRadioGroupStyles,
} from './source.styles';
import messages from './source.messages';
import { TextInput } from '../../../../shared/components/form/inputs/textInput';
import {
  DATA_SOURCE_FILE,
  DATA_SOURCE_NAME,
  DATA_SOURCE_SCHEMA,
  DATA_SOURCE_TYPE,
  IGNORED_FIELDS,
  SOURCE_TYPE_API,
  SOURCE_TYPE_DATABASE,
  SOURCE_TYPE_FILE,
} from '../../../../modules/dataSource/dataSource.constants';

const { RadioGroup, RadioButton, Label, FileUpload } = Form;
const { CsvIcon } = Icons;

export class Source extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    bindSubmitForm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    updateDataSource: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        dataSourceId: PropTypes.string.isRequired,
        step: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  handleUploadChange = ({
    currentTarget: {
      files: [uploadFile],
    },
    setFieldValue,
  }) => {
    setFieldValue('file', uploadFile);
    setFieldValue('fileName', pathOr('', ['name'], uploadFile));
  };

  handleSubmit = requestData => {
    const { projectId, dataSourceId, step } = this.props.match.params;
    this.props.updateDataSource({ requestData, projectId, dataSourceId, step });
  };

  renderCsvUploader = ({ setFieldValue, fileName }) => (
    <FileUpload
      fileName={fileName}
      name={DATA_SOURCE_FILE}
      label={this.props.intl.formatMessage(messages.fileName)}
      type="file"
      id="fileUpload"
      onChange={({ currentTarget }) => this.handleUploadChange({ currentTarget, setFieldValue })}
      accept=".csv,.tsv"
    />
  );

  renderSourceUpload = ({ setFieldValue, type, fileName }) =>
    cond([
      [equals(SOURCE_TYPE_FILE), () => this.renderCsvUploader({ setFieldValue, fileName })],
      [equals(SOURCE_TYPE_API), () => {}],
      [equals(SOURCE_TYPE_DATABASE), () => {}],
      [T, always(null)],
    ])(type);

  render() {
    const { dataSource, bindSubmitForm, ...restProps } = this.props;

    return (
      <Container>
        <Formik
          enableReinitialize
          isInitialValid
          initialValues={omit(IGNORED_FIELDS, dataSource)}
          validationSchema={DATA_SOURCE_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ handleChange, values: { name, type, fileName }, setFieldValue, submitForm, dirty, isValid }) => {
            if (dirty && isValid) {
              bindSubmitForm(submitForm);
            }

            return (
              <Fragment>
                <TextInput
                  value={name || ''}
                  onChange={handleChange}
                  name={DATA_SOURCE_NAME}
                  fullWidth
                  label={this.props.intl.formatMessage(messages.name)}
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
                  <RadioButton label={this.props.intl.formatMessage(messages.spreadsheet)} value="file" id="file">
                    <Button customStyles={customButtonStyles} type="button">
                      <CsvIcon />
                    </Button>
                  </RadioButton>
                </RadioGroup>
                {this.renderSourceUpload({ type, setFieldValue, fileName })}
              </Fragment>
            );
          }}
        </Formik>
      </Container>
    );
  }
}
