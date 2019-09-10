import React, { PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, cond, equals, pathOr, T } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Container,
  customButtonStyles,
  customLabelStyles,
  customRadioButtonStyles,
  customRadioGroupStyles,
} from './source.styles';
import messages from './source.messages';
import { TextInput } from '../../../../../shared/components/form/inputs/textInput';
import {
  DATA_SOURCE_FILE,
  DATA_SOURCE_NAME,
  DATA_SOURCE_TYPE,
  SOURCE_TYPE_API,
  SOURCE_TYPE_DATABASE,
  SOURCE_TYPE_FILE,
} from '../../../../../modules/dataSource/dataSource.constants';

const { RadioGroup, RadioButton, Label, FileUpload } = Form;
const { CsvIcon } = Icons;

export class Source extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    uploadFileName: null,
  };

  handleUploadChange = ({
    currentTarget: {
      files: [uploadFile],
    },
  }) => {
    this.props.setFieldValue('file', uploadFile);
    this.setState({ uploadFileName: pathOr('', ['name'], uploadFile) });
  };

  renderCsvUploader = () => (
    <FileUpload
      fileName={this.state.uploadFileName || this.props.dataSource.fileName}
      name={DATA_SOURCE_FILE}
      label={this.props.intl.formatMessage(messages.fileName)}
      type="file"
      id="fileUpload"
      onChange={this.handleUploadChange}
      accept=".csv,.tsv"
    />
  );

  renderSourceUpload = cond([
    [equals(SOURCE_TYPE_FILE), this.renderCsvUploader],
    [equals(SOURCE_TYPE_API), () => {}],
    [equals(SOURCE_TYPE_DATABASE), () => {}],
    [T, always(null)],
  ]);

  render() {
    const { onChange, values, ...restProps } = this.props;

    return (
      <Container>
        <TextInput
          value={values.name || ''}
          onChange={onChange}
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
          value={this.props.values.type}
          onChange={onChange}
        >
          <RadioButton label={this.props.intl.formatMessage(messages.spreadsheet)} value="file" id="file">
            <Button customStyles={customButtonStyles} type="button">
              <CsvIcon />
            </Button>
          </RadioButton>
        </RadioGroup>
        {this.renderSourceUpload(this.props.values.type)}
      </Container>
    );
  }
}
