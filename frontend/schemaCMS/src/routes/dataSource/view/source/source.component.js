import React, { Fragment, PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, cond, equals, omit, pathOr, T } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { withTheme } from 'styled-components';

import {
  buttonStyles,
  Container,
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
import { StepNavigation } from '../../../../shared/components/stepNavigation';

const { RadioGroup, RadioButton, Label, FileUpload } = Form;
const { CsvIcon } = Icons;

export class SourceComponent extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    updateDataSource: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
        step: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loading: false,
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

  handleSubmit = async requestData => {
    const { dataSourceId, step } = this.props.match.params;

    try {
      this.setState({ loading: true });
      await this.props.updateDataSource({ requestData, dataSourceId, step });
    } catch (e) {
      this.setState({ loading: false });
    }
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

  renderRadioButton = type => {
    const { active, unActive } = this.props.theme.radioButton;
    const { fill, background } = type === DATA_SOURCE_FILE ? active : unActive;

    return (
      <RadioButton
        label={this.props.intl.formatMessage(messages.spreadsheet)}
        value={DATA_SOURCE_FILE}
        id={DATA_SOURCE_FILE}
      >
        <Button customStyles={{ background, ...buttonStyles }} type="button">
          <CsvIcon customStyles={{ fill }} />
        </Button>
      </RadioButton>
    );
  };

  render() {
    const { dataSource, ...restProps } = this.props;
    const { loading } = this.state;

    return (
      <Container>
        <Formik
          enableReinitialize
          initialValues={omit(IGNORED_FIELDS, dataSource)}
          validationSchema={DATA_SOURCE_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ handleChange, values: { name, type, fileName }, setFieldValue, submitForm, dirty, isValid, ...rest }) => {
            if (!dirty && isValid) {
              submitForm = null;
            }

            return (
              <Fragment>
                <TextInput
                  value={name || ''}
                  onChange={handleChange}
                  name={DATA_SOURCE_NAME}
                  fullWidth
                  label={this.props.intl.formatMessage(messages.name)}
                  {...rest}
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
                {this.renderSourceUpload({ type, setFieldValue, fileName })}
                <StepNavigation loading={loading} dataSource={dataSource} submitForm={submitForm} {...restProps} />
              </Fragment>
            );
          }}
        </Formik>
      </Container>
    );
  }
}

export const Source = withTheme(SourceComponent);
