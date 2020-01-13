import React, { createRef, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import {
  always,
  append,
  equals,
  filter,
  find,
  findLastIndex,
  flatten,
  ifElse,
  includes,
  isEmpty,
  map,
  pathEq,
  pathOr,
  pipe,
  prop,
  propEq,
  reject,
  toString,
  uniq,
} from 'ramda';
import Helmet from 'react-helmet';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import {
  ANIMATION_SPEED,
  CHECKBOX_HEIGHT,
  CheckboxContent,
  CheckBoxStyles,
  Dot,
  Empty,
  Error,
  Header,
  IconWrapper,
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
import reportError from '../../../shared/utils/reportError';
import { Draggable } from '../../../shared/components/draggable';

const { CheckboxGroup, Checkbox, FileUpload } = Form;
const { MenuIcon } = Icons;

export class DataWranglingScripts extends PureComponent {
  static propTypes = {
    dataWranglingScripts: PropTypes.array.isRequired,
    imageScrapingFields: PropTypes.array.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    setScriptsList: PropTypes.func.isRequired,
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
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      const fromScript = pathOr(false, ['history', 'location', 'state', 'fromScript'], this.props);

      await this.props.fetchDataWranglingScripts({ dataSourceId, fromScript });
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  getScriptLink = ({ id, type }) => {
    return type === SCRIPT_TYPES.UPLOADED
      ? `/script/${id}`
      : `/script/${id}/${getMatchParam(this.props, 'dataSourceId')}`;
  };

  checkboxesRef = createRef();

  parseSteps = (script, index) =>
    ifElse(
      pathEq(['specs', 'type'], IMAGE_SCRAPING_SCRIPT_TYPE),
      always({ script: prop('id', script), execOrder: index, options: { columns: this.props.imageScrapingFields } }),
      always({ script: prop('id', script), execOrder: index })
    )(script);

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
    } catch (error) {
      reportError(error);
      this.setState({ uploading: false, errorMessage: 'errorOnUploading' });
    }
  };

  handleChange = ({ e, setFieldValue, steps }) => {
    const { value, checked } = e.target;
    const scripts = this.props.dataWranglingScripts.map((script, index) => {
      if (script.id.toString() === value) {
        return { ...script, checked, index };
      }

      return { ...script, index };
    });
    const script = find(propEq('id', parseInt(value, 10)), scripts);

    if (checked && script.specs.type === IMAGE_SCRAPING_SCRIPT_TYPE && isEmpty(this.props.imageScrapingFields)) {
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');

      return this.props.history.push(`/script/${value}/${dataSourceId}`);
    }
    const scriptIndex = script.index;
    const lastCheckedIndex = findLastIndex(propEq('checked', true), this.props.dataWranglingScripts);
    const moveIndex = checked ? lastCheckedIndex + 1 : lastCheckedIndex;
    const animation = moveIndex !== scriptIndex;
    const setScripts = ifElse(equals(true), always(append(value, steps)), always(reject(equals(value), steps)));

    this.handleMove(scriptIndex, moveIndex, animation, checked, true);

    return setFieldValue('steps', setScripts(checked));
  };

  handleSubmit = async ({ steps }, { setSubmitting }) => {
    try {
      setSubmitting(true);
      this.setState({ errorMessage: '' });
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      const parsedSteps = pipe(
        map(script => ({ ...script, id: `${script.id}` })),
        filter(script => includes(prop('id', script), steps)),
        steps => steps.map(this.parseSteps)
      )(this.props.dataWranglingScripts);

      await this.props.sendUpdatedDataWranglingScript({ steps: parsedSteps, dataSourceId });
    } catch (error) {
      reportError(error);
      window.scrollTo(0, 0);
      this.setState({ errorMessage: 'errorJobFailed' });
    } finally {
      setSubmitting(false);
    }
  };

  handleMove = (dragIndex, hoverIndex, animation = false, checked, change) => {
    const { dataWranglingScripts } = this.props;
    let tempScripts = [...dataWranglingScripts.asMutable({ deep: true })];
    const dragCard = tempScripts[dragIndex];
    if (change) {
      dragCard.checked = checked;
    }

    tempScripts.splice(dragIndex, 1);
    tempScripts.splice(hoverIndex, 0, dragCard);
    tempScripts = tempScripts.map((script, index) => ({ ...script, order: index }));

    if (!animation) {
      return this.props.setScriptsList(tempScripts);
    }

    const checkbox = this.checkboxesRef.current.children[dragIndex].children[0];
    const checkboxStyle = checkbox.style;

    checkboxStyle.opacity = 0;
    checkboxStyle.height = '0px';

    return setTimeout(() => {
      this.props.setScriptsList(tempScripts);
      setTimeout(() => {
        checkboxStyle.opacity = 1;
        checkboxStyle.height = `${CHECKBOX_HEIGHT}px`;
      });
    }, ANIMATION_SPEED);
  };

  renderCheckboxes = ({ id, name, type = SCRIPT_TYPES.CUSTOM }, index) => {
    return (
      <Draggable key={id} accept="CHECKBOX" onMove={this.handleMove} id={id} index={index}>
        {makeDraggable => {
          const draggableIcon = makeDraggable(
            <IconWrapper>
              <MenuIcon />
            </IconWrapper>
          );

          return (
            <Checkbox id={`checkbox-${index}`} value={id.toString()}>
              <CheckboxContent>
                {draggableIcon}
                <Link to={this.getScriptLink({ id, type })}>
                  {name}
                  <Dot />
                  <Type>
                    <FormattedMessage {...messages[type]} />
                  </Type>
                </Link>
              </CheckboxContent>
            </Checkbox>
          );
        }}
      </Draggable>
    );
  };

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
    const { dataSource, isAdmin, dataWranglingScripts } = this.props;
    const { errorMessage, loading, error } = this.state;
    const steps = pipe(
      filter(propEq('checked', true)),
      map(
        pipe(
          prop('id'),
          toString
        )
      ),
      flatten,
      uniq
    )(dataWranglingScripts);
    const { jobsInProcess, name } = dataSource;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={name} headerSubtitle={headerSubtitle} projectId={dataSource.project.id} />
        <ContextHeader title={name} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error}>
          <Header>
            <Empty />
            <StepCounter>
              <FormattedMessage values={{ steps: dataWranglingScripts.length }} {...messages.steps} />
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
                  customCheckboxStyles={CheckBoxStyles}
                  value={steps}
                  name="steps"
                  id="fieldStepsCheckboxGroup"
                >
                  <div ref={this.checkboxesRef}>{dataWranglingScripts.map(this.renderCheckboxes)}</div>
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
