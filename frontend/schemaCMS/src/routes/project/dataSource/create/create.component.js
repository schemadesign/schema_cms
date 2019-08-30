import React, { PureComponent } from 'react';
import { Button, Form, Header, Icons, Stepper, Typography } from 'schemaUI';
import { always, cond, equals, path, T } from 'ramda';

import {
  Container,
  StepperContainer,
  customButtonStyles,
  customLabelStyles,
  customRadioButtonStyles,
  customRadioGroupStyles,
  stepperStyles,
} from './create.styles';

const { TextField, RadioGroup, RadioButton, Label, FileUpload } = Form;
const { H1, H2 } = Typography;
const { CsvIcon } = Icons;

export class Create extends PureComponent {
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
        <form onSubmit={e => e.preventDefault}>
          <TextField label="Name" name="Name" fullWidth />
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
        </form>
        <div>
          <Button type="button">Cancel</Button>
          <Button type="submit">Next</Button>
        </div>
        <StepperContainer>
          <Stepper activeStep={1} steps={6} customStyles={stepperStyles} />
        </StepperContainer>
      </Container>
    );
  }
}
