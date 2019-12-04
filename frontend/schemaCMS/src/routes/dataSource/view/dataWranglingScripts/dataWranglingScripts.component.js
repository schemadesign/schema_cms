import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import {
  always,
  append,
  equals,
  ifElse,
  pathOr,
  reject,
  map,
  pipe,
  toString,
  insertAll,
  propEq,
  find,
  pathEq,
  path,
} from 'ramda';

import { Container, Empty, Error, Header, Link, StepCounter, UploadContainer } from './dataWranglingScripts.styles';
import messages from './dataWranglingScripts.messages';
import { StepNavigation } from '../../../../shared/components/stepNavigation';
import {
  IMAGE_SCRAPING_SCRIPT_TYPE,
  SCRIPT_NAME_MAX_LENGTH,
} from '../../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { renderWhenTrue } from '../../../../shared/utils/rendering';

const { CheckboxGroup, Checkbox, FileUpload } = Form;

export class DataWranglingScripts extends PureComponent {
  static propTypes = {
    dataWranglingScripts: PropTypes.array.isRequired,
    customScripts: PropTypes.array.isRequired,
    imageScrapingFields: PropTypes.array.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWranglingScript: PropTypes.func.isRequired,
    dataSource: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
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

  getScriptLink = (scriptId, specs, dataSourceId) =>
    specs.type === IMAGE_SCRAPING_SCRIPT_TYPE ? `/script/${scriptId}/${dataSourceId}` : `/script/${scriptId}`;

  parseSteps = (script, index) =>
    ifElse(
      pathEq(['specs', 'type'], IMAGE_SCRAPING_SCRIPT_TYPE),
      always({ script, execOrder: index, options: { columns: this.props.imageScrapingFields } }),
      always({ script, execOrder: index })
    )(find(propEq('id', parseInt(script, 10)), this.props.dataWranglingScripts));

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
    const script = find(propEq('id', parseInt(value, 10)), this.props.dataWranglingScripts);

    if (checked && script.specs.type === IMAGE_SCRAPING_SCRIPT_TYPE) {
      const dataSourceId = path(['match', 'params', 'dataSourceId'], this.props);
      return this.props.history.push(`/script/${value}/${dataSourceId}`);
    }

    setFieldValue('steps', setScripts(checked));
  };

  handleSubmit = async ({ steps }, { setSubmitting }) => {
    try {
      setSubmitting(true);
      this.setState({ errorMessage: '' });
      const { dataSourceId } = this.props.match.params;
      const parsedSteps = steps.map(this.parseSteps);

      await this.props.sendUpdatedDataWranglingScript({ steps: parsedSteps, dataSourceId });
    } catch (error) {
      console.error(error);
      this.setState({ errorMessage: 'errorJobFailed' });
    } finally {
      setSubmitting(false);
    }
  };

  renderCheckboxes = ({ id, name, specs }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index}>
      <Link to={this.getScriptLink(id, specs, this.props.match.params.dataSourceId)}>{name}</Link>
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
