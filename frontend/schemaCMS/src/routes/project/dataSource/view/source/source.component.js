import React, { PureComponent } from 'react';
import { Button, Form, Icons } from 'schemaUI';
import { always, cond, equals, path, T } from 'ramda';

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
  static propTypes = {};

  state = {
    dataSourceType: '',
    uploadFileName: null,
  };

  handleChange = event => {
    const value = event.target.value;
    this.setState({ dataSourceType: value });
  };

  handleUploadChange = event => {
    const uploadFileName = path(['target', 'files', 0, 'name'], event);
    this.setState({ uploadFileName });
  };

  renderCsvUploader = () => (
    <FileUpload
      name={this.state.uploadFileName}
      label="File Name"
      type="file"
      id="File name"
      onChange={this.handleUploadChange}
      accept=".csv,.tsv"
    />
  );

  renderSourceUpload = cond([[equals('csv'), this.renderCsvUploader], [T, always(null)]]);

  render() {
    return (
      <Container>
        <TextField label="Name" name="Name" defaultValue="My New Dataset" fullWidth />
        <Label customStyles={customLabelStyles}>Source</Label>
        <RadioGroup
          name="dataSourceType"
          customStyles={customRadioGroupStyles}
          customLabelStyles={customRadioButtonStyles}
          value={this.state.dataSourceType}
          onChange={this.handleChange}
        >
          <RadioButton label="Csv" value="csv" id="csv">
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
