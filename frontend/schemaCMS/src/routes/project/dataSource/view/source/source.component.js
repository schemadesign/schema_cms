import React, { PureComponent } from 'react';
import { Button, Form as FormComponents, Header, Icons, Typography } from 'schemaUI';
import { always, cond, equals, path, T } from 'ramda';

import {
  Container,
  customButtonStyles,
  customLabelStyles,
  customRadioButtonStyles,
  customRadioGroupStyles,
  Form,
} from './source.styles';

const { TextField, RadioGroup, RadioButton, Label, FileUpload } = FormComponents;
const { H1, H2 } = Typography;
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
        <Header>
          <H2>Create Data Source</H2>
          <H1>Source</H1>
        </Header>
        <Form onSubmit={e => e.preventDefault}>
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

          <div>
            <Button type="button">Cancel</Button>
            <Button type="submit">Next</Button>
          </div>
        </Form>
      </Container>
    );
  }
}
