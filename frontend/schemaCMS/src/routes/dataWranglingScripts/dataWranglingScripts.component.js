import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { always, append, ifElse, equals, reject } from 'ramda';

import { Container, Header, StepCounter, Empty, UploadContainer, Error, Link } from './dataWranglingScripts.styles';
import messages from './dataWranglingScripts.messages';
import { renderWhenTrue } from '../../shared/utils/rendering';

const { CheckboxGroup, Checkbox, FileUpload } = Form;

export class DataWrangling extends PureComponent {
  static propTypes = {
    dataWranglings: PropTypes.array.isRequired,
    bindSubmitForm: PropTypes.func.isRequired,
    fetchDataWrangling: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWrangling: PropTypes.func.isRequired,
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    uploading: false,
    errorOnUploading: false,
  };

  componentDidMount() {
    const { dataSourceId } = this.props.match.params;
    this.props.fetchDataWrangling({ dataSourceId });
  }

  getScrtiptUrl = index => {
    const baseUrl = this.props.match.url.replace(/\d+\/?$/, 'script/view/');

    return `${baseUrl}${index}`;
  };

  handleUploadScript = async ({ target }) => {
    const [file] = target.files;
    if (!file) {
      return;
    }

    try {
      const { dataSourceId } = this.props.match.params;
      this.setState({ uploading: true, errorOnUploading: false });

      await this.props.uploadScript({ script: file, dataSourceId });
    } catch (e) {
      this.setState({ uploading: false, errorOnUploading: true });
    }
  };

  handleChange = ({ e, setFieldValue, steps }) => {
    const { value, checked } = e.target;
    const setScripts = ifElse(equals(true), always(append(value, steps)), always(reject(equals(value), steps)));

    setFieldValue('steps', setScripts(checked));
  };

  handleSubmit = ({ steps }) => {
    const { dataSourceId, projectId } = this.props.match.params;
    steps = steps.map(step => ({ key: step }));

    this.props.sendUpdatedDataWrangling({ steps, projectId, dataSourceId });
  };

  renderCheckboxes = (values, data) =>
    values.map(({ key }, index) => (
      <Checkbox id={`checkbox-${index}`} value={data[index]} key={index} isEdit>
        <Link to={this.getScrtiptUrl(index)}>{key}</Link>
      </Checkbox>
    ));

  renderErrorOnUploading = renderWhenTrue(
    always(
      <Error>
        <FormattedMessage {...messages.errorOnUploading} />
      </Error>
    )
  );

  render() {
    const { bindSubmitForm, dataWranglings } = this.props;
    const { uploading, errorOnUploading } = this.state;
    const data = dataWranglings.map(({ key }) => key);

    return (
      <Container>
        <Header>
          <Empty />
          <StepCounter>
            <FormattedMessage values={{ length: dataWranglings.length }} {...messages.steps} />
            {this.renderErrorOnUploading(errorOnUploading)}
          </StepCounter>
          <UploadContainer>
            <FileUpload
              type="file"
              id="fileUpload"
              onChange={this.handleUploadScript}
              accept=".py"
              disabled={uploading}
            />
          </UploadContainer>
        </Header>
        <Formik initialValues={{ steps: [] }} onSubmit={this.handleSubmit}>
          {({ values: { steps }, submitForm, dirty, isValid, setFieldValue }) => {
            if (dirty && isValid && !uploading) {
              bindSubmitForm(submitForm);
            }
            return (
              <CheckboxGroup onChange={e => this.handleChange({ e, setFieldValue, steps })} value={steps} name="steps">
                {this.renderCheckboxes(dataWranglings, data)}
              </CheckboxGroup>
            );
          }}
        </Formik>
      </Container>
    );
  }
}
