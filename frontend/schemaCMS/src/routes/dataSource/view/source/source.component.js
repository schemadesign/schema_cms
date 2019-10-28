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
  WarningWrapper,
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
import { Uploader } from '../../../../shared/components/form/uploader';
import { errorMessageParser } from '../../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../../shared/utils/rendering';

const { RadioGroup, RadioButton, Label } = Form;
const { CsvIcon } = Icons;

export class SourceComponent extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    isAnyJobProcessing: PropTypes.bool.isRequired,
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

  handleSubmit = async (requestData, { setErrors }) => {
    const { dataSourceId, step } = this.props.match.params;

    try {
      this.setState({ loading: true });
      await this.props.updateDataSource({ requestData, dataSourceId, step });
    } catch (errors) {
      const { formatMessage } = this.props.intl;
      const errorMessages = errorMessageParser({ errors, messages, formatMessage });

      setErrors(errorMessages);
      this.setState({ loading: false });
    }
  };

  renderProcessingMessage = renderWhenTrue(
    always(
      <WarningWrapper>
        <FormattedMessage {...messages.processing} />
      </WarningWrapper>
    )
  );

  renderCsvUploader = ({ setFieldValue, fileName, isAnyJobProcessing, ...restProps }) => (
    <Uploader
      fileName={fileName}
      name={DATA_SOURCE_FILE}
      label={this.props.intl.formatMessage(messages.fileName)}
      type="file"
      id="fileUpload"
      onChange={({ currentTarget }) => this.handleUploadChange({ currentTarget, setFieldValue })}
      accept=".csv,.tsv"
      disabled={isAnyJobProcessing}
      {...restProps}
    />
  );

  renderSourceUpload = ({ type, ...restProps }) =>
    cond([
      [
        equals(SOURCE_TYPE_FILE),
        () => (
          <Fragment>
            {this.renderCsvUploader({ ...restProps, isAnyJobProcessing: this.props.isAnyJobProcessing })}
            {this.renderProcessingMessage(this.props.isAnyJobProcessing)}
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
          isInitialValid={!!dataSource.fileName}
          initialValues={omit(IGNORED_FIELDS, dataSource)}
          validationSchema={DATA_SOURCE_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ handleChange, values: { name, type, fileName }, submitForm, dirty, isValid, ...rest }) => {
            if (!dirty && isValid) {
              submitForm = null;
            }
            const disabled = { next: !fileName || !isValid };

            return (
              <Fragment>
                <TextInput
                  value={name || ''}
                  onChange={handleChange}
                  name={DATA_SOURCE_NAME}
                  fullWidth
                  checkOnlyErrors
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
                {this.renderSourceUpload({ type, fileName, ...rest })}
                <StepNavigation
                  loading={loading}
                  disabled={disabled}
                  dataSource={dataSource}
                  submitForm={submitForm}
                  {...restProps}
                />
              </Fragment>
            );
          }}
        </Formik>
      </Container>
    );
  }
}

export const Source = withTheme(SourceComponent);
