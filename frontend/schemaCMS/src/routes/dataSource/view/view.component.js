import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { always, cond, equals, T } from 'ramda';

import { Container, stepperBlockStyles, StepperContainer, stepperStyles } from './view.styles';
import messages from './view.messages';
import { Source } from './source';
import { DataPreview } from '../../../shared/components/dataPreview';
import { DataWranglingScripts } from '../../dataWranglingScripts';
import { PillButtons } from '../../../shared/components/pillButtons';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { TopHeader } from '../../../shared/components/topHeader';
import {
  DATA_WRANGLING_STEP,
  FIELDS_STEP,
  INITIAL_STEP,
  MAX_STEPS,
  STATUS_DRAFT,
} from '../../../modules/dataSource/dataSource.constants';

export class View extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    dataWranglingScripts: PropTypes.array.isRequired,
    fetchDataSource: PropTypes.func.isRequired,
    unmountDataSource: PropTypes.func.isRequired,
    removeDataSource: PropTypes.func.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWranglingScript: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
        dataSourceId: PropTypes.string.isRequired,
        step: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    if (!this.props.dataSource.id) {
      const { dataSourceId } = this.props.match.params;

      this.props.fetchDataSource({ dataSourceId });
    }
  }

  componentWillUnmount() {
    this.props.unmountDataSource();
  }

  getHeaderSubtitle = cond([
    [equals(INITIAL_STEP), always(this.props.intl.formatMessage(messages.source))],
    [equals(FIELDS_STEP), always(this.props.intl.formatMessage(messages.fields))],
    [equals(DATA_WRANGLING_STEP), always(this.props.intl.formatMessage(messages.dataWrangling))],
    [T, always(null)],
  ]);

  getTitle = intl =>
    this.props.dataSource.status === STATUS_DRAFT ? intl.formatMessage(messages.title) : this.props.dataSource.name;

  getHeaderAndMenuConfig = (intl, activeStep) => {
    const headerTitle = this.getTitle(intl);
    const projectId = this.props.dataSource.projectId;

    const secondaryMenuItems = [
      {
        label: this.props.intl.formatMessage(messages.dataSourceList),
        to: `/project/view/${projectId}/datasource/list`,
      },
      {
        label: this.props.intl.formatMessage(messages.removeDataSource),
        onClick: () => this.props.removeDataSource(this.props.match.params),
      },
    ];

    return {
      headerTitle,
      headerSubtitle: this.getHeaderSubtitle(activeStep),
      secondaryMenuItems,
    };
  };

  submitForm = null;

  bindSubmitForm = submitForm => {
    this.submitForm = submitForm;
  };

  handleNextClick = () => {
    if (this.submitForm) {
      return this.submitForm();
    }

    return this.handleStepChange(parseInt(this.props.match.params.step, 10) + 1);
  };

  handleStepChange = step => {
    const {
      history,
      match: {
        params: { projectId, dataSourceId },
      },
    } = this.props;

    history.push(`/project/view/${projectId}/datasource/view/${dataSourceId}/${step}`);
  };

  handleBackClick = () => this.handleStepChange(parseInt(this.props.match.params.step, 10) - 1);

  handleCancelClick = () =>
    this.props.history.push(`/project/view/${this.props.match.params.projectId}/datasource/list`);

  renderContentForm = ({ activeStep, ...props }) =>
    cond([
      [equals(INITIAL_STEP), always(<Source bindSubmitForm={this.bindSubmitForm} {...props} />)],
      [equals(FIELDS_STEP), always(<DataPreview {...props} />)],
      [equals(DATA_WRANGLING_STEP), always(<DataWranglingScripts bindSubmitForm={this.bindSubmitForm} {...props} />)],
      [equals(4), always(null)],
      [equals(5), always(null)],
      [equals(6), always(null)],
      [T, always(null)],
    ])(activeStep);

  renderContent = renderWhenTrue(() => {
    const {
      intl,
      dataSource,
      match: {
        params: { step },
      },
    } = this.props;
    const activeStep = parseInt(step, 10);
    const topHeaderConfig = this.getHeaderAndMenuConfig(intl, activeStep);
    const customStepperStyles =
      dataSource.status === STATUS_DRAFT ? { ...stepperStyles, ...stepperBlockStyles } : stepperStyles;
    const cancelProps = {
      title: intl.formatMessage(messages.cancel),
      onClick: this.handleCancelClick,
    };
    const backProps = {
      title: intl.formatMessage(messages.back),
      onClick: this.handleBackClick,
    };
    const leftButtonProps = activeStep === INITIAL_STEP ? cancelProps : backProps;
    this.submitForm = null;

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        {this.renderContentForm({
          activeStep,
          intl,
          dataSource,
          ...this.props,
        })}
        <PillButtons
          leftButtonProps={leftButtonProps}
          rightButtonProps={{
            title: intl.formatMessage(messages.next),
            onClick: this.handleNextClick,
          }}
        />
        <StepperContainer>
          <Stepper
            activeStep={activeStep}
            steps={MAX_STEPS}
            customStyles={customStepperStyles}
            onStepChange={this.handleStepChange}
          />
        </StepperContainer>
      </Fragment>
    );
  });

  render() {
    return <Container>{this.renderContent(!!this.props.dataSource.id)}</Container>;
  }
}
