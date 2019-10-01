import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { always, append, ifElse, equals, reject } from 'ramda';

import { Container, Header, StepCounter, Empty, UploadContainer, Error, Link } from './dataWranglingScripts.styles';
import messages from './dataWranglingScripts.messages';
import { renderWhenTrue } from '../../../../shared/utils/rendering';
import { StepNavigation } from '../../../../shared/components/stepNavigation';

const { CheckboxGroup, Checkbox, FileUpload } = Form;

export class DataWranglingScripts extends PureComponent {
  static propTypes = {
    dataWranglingScripts: PropTypes.array.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWranglingScript: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    uploading: false,
    errorOnUploading: false,
  };

  componentDidMount() {
    const { dataSourceId } = this.props.match.params;
    this.props.fetchDataWranglingScripts({ dataSourceId });
  }

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
    const { dataSourceId } = this.props.match.params;
    steps = steps.map(step => ({ key: step }));

    this.props.sendUpdatedDataWranglingScript({ steps, dataSourceId });
  };

  renderCheckboxes = (values, data) =>
    values.map(({ key }, index) => (
      <Checkbox id={`checkbox-${index}`} value={data[index]} key={index} isEdit>
        <Link to={`/script/${index}`}>{key}</Link>
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
    const { dataWranglingScripts } = this.props;
    const { uploading, errorOnUploading } = this.state;
    const data = dataWranglingScripts.map(({ key }) => key);

    return (
      <Container>
        <Header>
          <Empty />
          <StepCounter>
            <FormattedMessage values={{ length: dataWranglingScripts.length }} {...messages.steps} />
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
          {({ values: { steps }, setFieldValue, submitForm }) => {
            return (
              <Fragment>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setFieldValue, steps })}
                  value={steps}
                  name="steps"
                >
                  {this.renderCheckboxes(dataWranglingScripts, data)}
                </CheckboxGroup>
                <StepNavigation submitForm={submitForm} {...this.props} />
              </Fragment>
            );
          }}
        </Formik>
      </Container>
    );
  }
}
