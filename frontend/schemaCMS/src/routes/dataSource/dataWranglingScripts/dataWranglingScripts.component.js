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
  insert,
  map,
  pathEq,
  pathOr,
  pipe,
  prop,
  propEq,
  reject,
  toString,
  flatten,
  uniq,
} from 'ramda';
import Helmet from 'react-helmet';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import {
  Dot,
  Empty,
  Error,
  Header,
  Link,
  StepCounter,
  Type,
  UploadContainer,
  Warning,
} from './dataWranglingScripts.styles';
import messages from './dataWranglingScripts.messages';
import {
  IMAGE_SCRAPING_SCRIPT_TYPE,
  SCRIPT_NAME_MAX_LENGTH,
  SCRIPT_TYPES,
} from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getMatchParam } from '../../../shared/utils/helpers';
import { Draggable } from '../../../shared/components/draggable';

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
    orderedDataWranglingScripts: [],
  };

  async componentDidMount() {
    try {
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      const fromScript = pathOr(false, ['history', 'location', 'state', 'fromScript'], this.props);

      await this.props.fetchDataWranglingScripts({ dataSourceId, fromScript });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      this.setState({ error });
    } finally {
      this.setState({
        loading: false,
        orderedDataWranglingScripts: this.props.dataWranglingScripts.asMutable({ deep: true }),
      });
    }
  }

  getScriptLink = ({ id, type }) => {
    return type === SCRIPT_TYPES.UPLOADED
      ? `/script/${id}`
      : `/script/${id}/${getMatchParam(this.props, 'dataSourceId')}`;
  };

  parseSteps = (script, index) =>
    ifElse(
      pathEq(['specs', 'type'], IMAGE_SCRAPING_SCRIPT_TYPE),
      always({ script, execOrder: index, options: { columns: this.state.orderedDataWranglingScripts } }),
      always({ script, execOrder: index })
    )(find(propEq('id', parseInt(script, 10)), this.state.orderedDataWranglingScripts));

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
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
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
    const script = find(propEq('id', parseInt(value, 10)), this.state.orderedDataWranglingScripts);

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
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
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

  handleMove = (dragIndex, hoverIndex) => {
    const { orderedDataWranglingScripts } = this.state;
    const dragCard = orderedDataWranglingScripts[dragIndex];

    let tempScripts = [...orderedDataWranglingScripts];

    tempScripts.splice(dragIndex, 1);
    tempScripts.splice(hoverIndex, 0, dragCard);

    this.setState({
      orderedDataWranglingScripts: tempScripts,
    });
  };

  renderCheckboxes = ({ id, name, specs, type = 'custom' }, index) => (
    <Draggable key={id} accept="CHECKBOX" onMove={this.handleMove} id={id} index={index}>
      <Checkbox id={`checkbox-${index}`} value={id.toString()}>
        <Link to={this.getScriptLink(id, specs, getMatchParam(this.props, 'dataSourceId'), this.props)}>
          {name}
          <Dot />
          <Type>
            <FormattedMessage {...messages[type]} />
          </Type>
        </Link>
      </Checkbox>
    </Draggable>
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
    const { dataSource, isAdmin, customScripts } = this.props;
    const { errorMessage, loading, error, orderedDataWranglingScripts } = this.state;
    const steps = pipe(
      pathOr([], ['activeJob', 'scripts']),
      map(
        pipe(
          prop('id'),
          toString
        )
      ),
      insert(0, customScripts),
      flatten,
      uniq
    )(dataSource);

    const { jobsInProcess, name } = dataSource;

    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <DndProvider backend={Backend}>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={name} headerSubtitle={headerSubtitle} projectId={dataSource.project} />
        <ContextHeader title={name} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error}>
          <Header>
            <Empty />
            <StepCounter>
              <FormattedMessage values={{ length: orderedDataWranglingScripts.length }} {...messages.steps} />
              {this.renderUploadingError(errorMessage)}
              {this.renderProcessingWarning(jobsInProcess)}
            </StepCounter>
            <UploadContainer>{this.renderUploadButton(isAdmin)}</UploadContainer>
          </Header>
          <Formik initialValues={{ steps }} isInitialValid enableReinitialize onSubmit={this.handleSubmit}>
            {({ values: { steps }, setFieldValue, submitForm, isSubmitting }) => (
              <Fragment>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setFieldValue, steps })}
                  value={steps}
                  name="steps"
                  id="fieldStepsCheckboxGroup"
                >
                  {orderedDataWranglingScripts.map(this.renderCheckboxes)}
                </CheckboxGroup>
                <NavigationContainer right>
                  <NextButton
                    onClick={submitForm}
                    disabled={isSubmitting || jobsInProcess || !steps.length}
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
      </DndProvider>
    );
  }
}
