import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import {
  always,
  append,
  equals,
  find,
  ifElse,
  insertAll,
  map,
  pathEq,
  pathOr,
  pipe,
  prop,
  propEq,
  reject,
  toString,
} from 'ramda';
import Helmet from 'react-helmet';

import { Empty, Error, Header, Link, StepCounter, UploadContainer, Warning } from './dataWranglingScripts.styles';
import messages from './dataWranglingScripts.messages';
import {
  IMAGE_SCRAPING_SCRIPT_TYPE,
  SCRIPT_NAME_MAX_LENGTH,
} from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getMatchParam } from '../../../shared/utils/helpers';

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
    intl: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
    uploading: false,
    errorMessage: '',
    error: null,
  };

  async componentDidMount() {
    try {
      const { dataSourceId } = this.props.match.params;
      await this.props.fetchDataWranglingScripts({ dataSourceId });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
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
      // eslint-disable-next-line no-console
      console.error(e);
      this.setState({ uploading: false, errorMessage: 'errorOnUploading' });
    }
  };

  handleChange = ({ e, setFieldValue, steps }) => {
    const { value, checked } = e.target;
    const setScripts = ifElse(equals(true), always(append(value, steps)), always(reject(equals(value), steps)));
    const script = find(propEq('id', parseInt(value, 10)), this.props.dataWranglingScripts);

    if (checked && script.specs.type === IMAGE_SCRAPING_SCRIPT_TYPE) {
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      return this.props.history.push(`/script/${value}/${dataSourceId}`);
    }

    return setFieldValue('steps', setScripts(checked));
  };

  handleSubmit = async ({ steps }, { setSubmitting }) => {
    try {
      setSubmitting(true);
      this.setState({ errorMessage: '' });
      const { dataSourceId } = this.props.match.params;
      const parsedSteps = steps.map(this.parseSteps);

      await this.props.sendUpdatedDataWranglingScript({ steps: parsedSteps, dataSourceId });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      window.scrollTo(0, 0);
      this.setState({ errorMessage: 'errorJobFailed' });
    } finally {
      setSubmitting(false);
    }
  };

  renderCheckboxes = ({ id, name, specs }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index}>
      <Link to={this.getScriptLink(id, specs, getMatchParam(this.props, 'dataSourceId'), this.props)}>{name}</Link>
    </Checkbox>
  );

  renderUploadingError = errorMessage =>
    renderWhenTrue(() => (
      <Error>
        <FormattedMessage {...messages[errorMessage]} />
      </Error>
    ))(!!errorMessage.length);

  renderProcessingWarning = renderWhenTrue(
    always(
      <Warning>
        <FormattedMessage {...messages.ongoingProcess} />
      </Warning>
    )
  );

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
    const { errorMessage, loading, error } = this.state;
    const steps = pipe(
      pathOr([], ['activeJob', 'scripts']),
      map(
        pipe(
          prop('id'),
          toString
        )
      ),
      insertAll(0, customScripts)
    )(dataSource);

    const { jobsInProcess, name } = dataSource;

    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={name} headerSubtitle={headerSubtitle} projectId={dataSource.project} />
        <ContextHeader title={name} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error}>
          <Header>
            <Empty />
            <StepCounter>
              <FormattedMessage values={{ length: dataWranglingScripts.length }} {...messages.steps} />
              {this.renderUploadingError(errorMessage)}
              {this.renderProcessingWarning(jobsInProcess)}
            </StepCounter>
            <UploadContainer>{this.renderUploadButton(isAdmin)}</UploadContainer>
          </Header>
          <Formik initialValues={{ steps }} onSubmit={this.handleSubmit}>
            {({ values: { steps }, setFieldValue, submitForm, isSubmitting, dirty }) => (
              <Fragment>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setFieldValue, steps })}
                  value={steps}
                  name="steps"
                  id="fieldStepsCheckboxGroup"
                >
                  {dataWranglingScripts.map(this.renderCheckboxes)}
                </CheckboxGroup>
                <NavigationContainer right>
                  <NextButton
                    onClick={submitForm}
                    disabled={!dirty || isSubmitting || jobsInProcess || !steps.length}
                    loading={isSubmitting}
                  >
                    <FormattedMessage {...messages.save} />
                  </NextButton>
                </NavigationContainer>
                <DataSourceNavigation {...this.props} hideOnDesktop />
              </Fragment>
            )}
          </Formik>
        </LoadingWrapper>
      </Fragment>
    );
  }
}
