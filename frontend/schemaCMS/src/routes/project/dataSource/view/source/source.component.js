import React, { PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, cond, equals, path, T } from 'ramda';
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
    dataSourceType: this.props.values.type || '',
    uploadFileName: null,
  };

  handleChange = event => {
    const value = event.target.value;

    this.props.onChange(event);
    this.setState({ dataSourceType: value });
  };

  handleUploadChange = event => {
    const uploadFile = path(['currentTarget', 'files', 0], event);

    this.props.setFieldValue('file', uploadFile);
    this.setState({ uploadFileName: uploadFile.name });
  };

  renderCsvUploader = () => (
    <FileUpload
      fileName={this.state.uploadFileName || this.props.dataSource.fileName}
      name="file"
      label={this.props.intl.formatMessage(messages.fileName)}
      type="file"
      id="fileUpload"
      onChange={this.handleUploadChange}
      accept=".csv,.tsv"
    />
  );

  renderSourceUpload = cond([[equals('file'), this.renderCsvUploader], [T, always(null)]]);

  render() {
    const { onChange, values, ...restProps } = this.props;

    return (
      <Container>
        <TextInput
          value={values.name || ''}
          onChange={onChange}
          name="name"
          fullWidth
          label={this.props.intl.formatMessage(messages.name)}
          {...restProps}
        />

        <Label customStyles={customLabelStyles}>
          <FormattedMessage {...messages.source} />
        </Label>
        <RadioGroup
          name="type"
          customStyles={customRadioGroupStyles}
          customLabelStyles={customRadioButtonStyles}
          value={this.state.dataSourceType}
          onChange={this.handleChange}
        >
          <RadioButton label={this.props.intl.formatMessage(messages.spreadsheet)} value="file" id="file">
            <Button customStyles={customButtonStyles} type="button">
              <CsvIcon />
            </Button>
          </RadioButton>
        </RadioGroup>
        {this.renderSourceUpload(this.state.dataSourceType)}
      </Container>
    );
  }
}
