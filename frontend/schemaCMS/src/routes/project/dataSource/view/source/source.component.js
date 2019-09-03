import React, { PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, cond, equals, path, T } from 'ramda';
import PropTypes from 'prop-types';

import {
  Container,
  customButtonStyles,
  customLabelStyles,
  customRadioButtonStyles,
  customRadioGroupStyles,
} from './source.styles';

const { TextField, RadioGroup, RadioButton, Label, FileUpload } = Form;
const { CsvIcon } = Icons;

export class Source extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
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
      fileName={this.state.uploadFileName || this.props.values.file}
      name="file"
      label="File Name"
      type="file"
      id="File name"
      onChange={this.handleUploadChange}
      accept=".csv,.tsv"
    />
  );

  renderSourceUpload = cond([[equals('file'), this.renderCsvUploader], [T, always(null)]]);

  render() {
    const { onChange, values } = this.props;

    return (
      <Container>
        <TextField label="Name" name="name" value={values.name} onChange={onChange} fullWidth />
        <Label customStyles={customLabelStyles}>Source</Label>
        <RadioGroup
          name="type"
          customStyles={customRadioGroupStyles}
          customLabelStyles={customRadioButtonStyles}
          value={this.state.dataSourceType}
          onChange={this.handleChange}
        >
          <RadioButton label="Spreadsheet" value="file" id="file">
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
