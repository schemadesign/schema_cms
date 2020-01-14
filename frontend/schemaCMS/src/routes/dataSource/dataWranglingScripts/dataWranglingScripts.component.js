import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { asMutable } from 'seamless-immutable';
import { always, find, flatten, ifElse, isEmpty, map, pathEq, pathOr, pipe, prop, propEq, toString, uniq } from 'ramda';
import Helmet from 'react-helmet';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import {
  selectedLabelStyles,
  labelStyles,
  checkBoxContainerStyles,
  CheckboxContent,
  checkBoxStyles,
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

const { CheckboxGroup, Checkbox, FileUpload, Label } = Form;
const { MenuIcon } = Icons;

export class DataWranglingScripts extends PureComponent {
  static propTypes = {
    dataWranglingScripts: PropTypes.array.isRequired,
    checkedScripts: PropTypes.array.isRequired,
    uncheckedScripts: PropTypes.array.isRequired,
    imageScrapingFields: PropTypes.array.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    setScriptsList: PropTypes.func.isRequired,
    setCheckedScripts: PropTypes.func.isRequired,
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
    isSubmitting: false,
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

  handleChange = e => {
    const { value, checked } = e.target;
    const { imageScrapingFields, history, checkedScripts, uncheckedScripts } = this.props;
    const scripts = checked ? uncheckedScripts : checkedScripts;
    const script = find(propEq('id', parseInt(value, 10)), scripts);

    if (checked && script.specs.type === IMAGE_SCRAPING_SCRIPT_TYPE && isEmpty(imageScrapingFields)) {
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');

      return history.push(`/script/${value}/${dataSourceId}`);
    }

    return this.props.setScriptsList({ script, checked });
  };

  handleSubmit = async () => {
    try {
      this.setState({ errorMessage: '', isSubmitting: true });
      const { checkedScripts } = this.props;
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      const parsedSteps = pipe(steps => steps.map(this.parseSteps))(checkedScripts);

      await this.props.sendUpdatedDataWranglingScript({ steps: parsedSteps, dataSourceId });
    } catch (error) {
      reportError(error);
      window.scrollTo(0, 0);
      this.setState({ errorMessage: 'errorJobFailed' });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  handleMove = (dragIndex, hoverIndex) => {
    const { checkedScripts } = this.props;
    const tempScripts = asMutable(checkedScripts, { deep: true });
    const dragCard = tempScripts[dragIndex];

    tempScripts.splice(dragIndex, 1);
    tempScripts.splice(hoverIndex, 0, dragCard);

    return this.props.setCheckedScripts(tempScripts);
  };

  renderCheckbox = ({ id, name, type = SCRIPT_TYPES.CUSTOM, draggableIcon = '', idPrefix = '' }, index) => (
    <Checkbox id={`${idPrefix}checkbox-${index}`} value={id.toString()}>
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

  renderCheckboxWithDrag = ({ id, name, type = SCRIPT_TYPES.CUSTOM }, index) => {
    return (
      <Draggable key={id} accept="CHECKBOX" onMove={this.handleMove} id={id} index={index}>
        {makeDraggable => {
          const draggableIcon = makeDraggable(
            <IconWrapper>
              <MenuIcon />
            </IconWrapper>
          );

          return this.renderCheckbox({ id, name, type, draggableIcon, idPrefix: 'drag-' }, index);
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
    const { dataSource, isAdmin, dataWranglingScripts, checkedScripts = [], uncheckedScripts = [] } = this.props;
    const { errorMessage, loading, error, isSubmitting } = this.state;
    const steps = pipe(
      map(
        pipe(
          prop('id'),
          toString
        )
      ),
      flatten,
      uniq
    )(checkedScripts);
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
              <FormattedMessage values={{ steps: dataWranglingScripts.length }} {...messages.counterSteps} />
              {this.renderUploadingError(errorMessage)}
              {this.renderProcessingWarning(jobsInProcess)}
            </StepCounter>
            <UploadContainer>{this.renderUploadButton(isAdmin)}</UploadContainer>
          </Header>
          <Fragment>
            <CheckboxGroup
              onChange={this.handleChange}
              customCheckboxStyles={checkBoxStyles}
              customStyles={checkBoxContainerStyles}
              value={steps}
              name="steps"
              id="fieldStepsCheckboxGroup"
            >
              <Label customStyles={selectedLabelStyles}>
                <FormattedMessage {...messages.selectedScripts} />
              </Label>
              <div>{checkedScripts.map(this.renderCheckboxWithDrag)}</div>
              <Label customStyles={labelStyles}>
                <FormattedMessage {...messages.steps} />
              </Label>
              <div>
                {uncheckedScripts.map((item, index) => (
                  <div key={index}>{this.renderCheckbox(item, index)}</div>
                ))}
              </div>
            </CheckboxGroup>
            <NavigationContainer right>
              <NextButton
                onClick={this.handleSubmit}
                disabled={isSubmitting || jobsInProcess || !steps.length}
                loading={isSubmitting}
              >
                <FormattedMessage {...messages.save} />
              </NextButton>
            </NavigationContainer>
            <DataSourceNavigation {...this.props} hideOnDesktop />
          </Fragment>
        </LoadingWrapper>
      </DndProvider>
    );
  }
}
