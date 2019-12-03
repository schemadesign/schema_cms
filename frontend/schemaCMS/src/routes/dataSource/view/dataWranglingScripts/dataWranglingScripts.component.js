import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { always, append, equals, ifElse, pathOr, reject, map, pipe, toString, uniq, insertAll } from 'ramda';

import { Container, Empty, Error, Header, Link, StepCounter, UploadContainer } from './dataWranglingScripts.styles';
import messages from './dataWranglingScripts.messages';
import { StepNavigation } from '../../../../shared/components/stepNavigation';
import { SCRIPT_NAME_MAX_LENGTH } from '../../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { renderWhenTrue } from '../../../../shared/utils/rendering';

const { CheckboxGroup, Checkbox, FileUpload } = Form;

export class DataWranglingScripts extends PureComponent {
  static propTypes = {
    dataWranglingScripts: PropTypes.array.isRequired,
    customScripts: PropTypes.array.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWranglingScript: PropTypes.func.isRequired,
    dataSource: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    uploading: false,
    errorMessage: '',
  };

  componentDidMount() {
    const { dataSourceId } = this.props.match.params;
    this.props.fetchDataWranglingScripts({ dataSourceId });
  }

  getScriptLink = (scriptId, name, dataSourceId) =>
    name === 'Image Scrapping' ? `/script/${scriptId}/${dataSourceId}` : `/script/${scriptId}`;

  handleUploadScript = async ({ target }) => {
    const [file] = target.files;

    if (!file) {
      return;
    }

    if (file.name.length > SCRIPT_NAME_MAX_LENGTH) {
      this.setState({ errorMessage: 'errorTooLongName' });
      return;
    }

    try {
      const { dataSourceId } = this.props.match.params;
      this.setState({ uploading: true, errorMessage: '' });

      await this.props.uploadScript({ script: file, dataSourceId });
      this.setState({ uploading: false });
    } catch (e) {
      this.setState({ uploading: false, errorMessage: 'errorOnUploading' });
    }
  };

  handleChange = ({ e, setFieldValue, steps }) => {
    const { value, checked } = e.target;
    const setScripts = ifElse(equals(true), always(append(value, steps)), always(reject(equals(value), steps)));

    setFieldValue('steps', setScripts(checked));
  };

  handleSubmit = async ({ steps }, { setSubmitting }) => {
    try {
      setSubmitting(true);
      this.setState({ errorMessage: '' });
      const { dataSourceId } = this.props.match.params;
      steps = steps.map((script, index) => ({ script, execOrder: index }));

      await this.props.sendUpdatedDataWranglingScript({ steps, dataSourceId });
    } catch (error) {
      this.setState({ errorMessage: 'errorJobFailed' });
    } finally {
      setSubmitting(false);
    }
  };

  renderCheckboxes = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index}>
      <Link to={this.getScriptLink(id, name, this.props.match.params.dataSourceId)}>{name}</Link>
    </Checkbox>
  );

  renderUploadingError = errorMessage =>
    renderWhenTrue(() => (
      <Error>
        <FormattedMessage {...messages[errorMessage]} />
      </Error>
    ))(!!errorMessage.length);

  renderUploadButton = renderWhenTrue(
    always(
      <FileUpload
        type="file"
        id="fileUpload"
        onChange={this.handleUploadScript}
        accept=".py"
        disabled={this.state.uploading}
      />
    )
  );

  render() {
    const { dataWranglingScripts, dataSource, isAdmin, customScripts } = this.props;
    const { errorMessage } = this.state;
    const steps = pipe(
      pathOr([], ['activeJob', 'scripts']),
      map(toString),
      insertAll(0, customScripts)
    )(dataSource);

    return (
      <Container>
        <Header>
          <Empty />
          <StepCounter>
            <FormattedMessage values={{ length: dataWranglingScripts.length }} {...messages.steps} />
            {this.renderUploadingError(errorMessage)}
          </StepCounter>
          <UploadContainer>{this.renderUploadButton(isAdmin)}</UploadContainer>
        </Header>
        <Formik initialValues={{ steps }} onSubmit={this.handleSubmit}>
          {({ values: { steps }, setFieldValue, submitForm, isSubmitting }) => {
            if (!steps.length) {
              submitForm = null;
            }

            const disabled = { next: isSubmitting };

            return (
              <Fragment>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setFieldValue, steps })}
                  value={steps}
                  name="steps"
                  id="fieldStepsCheckboxGroup"
                >
                  {dataWranglingScripts.map(this.renderCheckboxes)}
                </CheckboxGroup>
                <StepNavigation submitForm={submitForm} loading={isSubmitting} disabled={disabled} {...this.props} />
              </Fragment>
            );
          }}
        </Formik>
      </Container>
    );
  }
}
