import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { always, cond, equals, T } from 'ramda';

import { Container, StepperContainer, stepperStyles, stepperBlockStyles } from './view.styles';
import messages from './view.messages';
import { Source } from './source';
import { Fields } from './fields';
import { DataWrangling } from './dataWrangling';
import { PillButtons } from '../../../../shared/components/pillButtons';
import { renderWhenTrue } from '../../../../shared/utils/rendering';
import { TopHeader } from '../../../../shared/components/topHeader';
import {
  STATUS_DRAFT,
  INITIAL_STEP,
  MAX_STEPS,
  FIELDS_STEP,
  DATA_WRANGLING_STEP,
} from '../../../../modules/dataSource/dataSource.constants';

export class View extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    dataWrangling: PropTypes.array,
    fetchDataSource: PropTypes.func.isRequired,
    unmountDataSource: PropTypes.func.isRequired,
    removeDataSource: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        dataSourceId: PropTypes.string.isRequired,
        step: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    dataWrangling: ['abc', 'sdfds'],
  };

  componentDidMount() {
    if (!this.props.values.id) {
      const { projectId, dataSourceId } = this.props.match.params;

      this.props.fetchDataSource({ projectId, dataSourceId });
    }
  }

  componentWillUnmount() {
    this.props.unmountDataSource();
  }

  getTitle = intl =>
    this.props.values.status === STATUS_DRAFT ? intl.formatMessage(messages.title) : this.props.values.name;

  getHeaderSubtitle = cond([
    [equals(INITIAL_STEP), always(this.props.intl.formatMessage(messages.source))],
    [equals(FIELDS_STEP), always(this.props.intl.formatMessage(messages.fields))],
    [equals(DATA_WRANGLING_STEP), always(this.props.intl.formatMessage(messages.dataWrangling))],
    [T, always(null)],
  ]);

  getHeaderAndMenuConfig = (intl, activeStep) => {
    const headerTitle = this.getTitle(intl);
    const secondaryMenuItems = [
      {
        label: this.props.intl.formatMessage(messages.dataSourceList),
        to: `/project/view/${this.props.match.params.projectId}/datasource/list`,
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

  handleStepChange = step => {
    const {
      history,
      match: {
        params: { projectId, dataSourceId },
      },
    } = this.props;

    history.push(`/project/view/${projectId}/datasource/view/${dataSourceId}/${step}`);
  };

  handleBackClick = () => this.handleStepChange(this.props.match.params.step - 1);

  handleCancelClick = () =>
    this.props.history.push(`/project/view/${this.props.match.params.projectId}/datasource/list`);

  renderContentForm = ({ activeStep, ...props }) =>
    cond([
      [equals(INITIAL_STEP), always(<Source {...props} />)],
      [equals(FIELDS_STEP), always(<Fields {...props} />)],
      [equals(DATA_WRANGLING_STEP), always(<DataWrangling {...props} />)],
      [equals(4), always(null)],
      [equals(5), always(null)],
      [equals(6), always(null)],
      [T, always(null)],
    ])(activeStep);

  renderContent = renderWhenTrue(() => {
    const {
      handleSubmit,
      values,
      handleChange,
      setFieldValue,
      intl,
      dataSource,
      match: {
        params: { step },
      },
    } = this.props;
    const activeStep = parseInt(step, 10);
    const topHeaderConfig = this.getHeaderAndMenuConfig(intl, activeStep);
    const cancelProps = {
      title: intl.formatMessage(messages.cancel),
      onClick: this.handleCancelClick,
    };
    const backProps = {
      title: intl.formatMessage(messages.back),
      onClick: this.handleBackClick,
    };
    const leftButtonProps = activeStep === INITIAL_STEP ? cancelProps : backProps;
    const customStepperStyles =
      dataSource.status === STATUS_DRAFT ? { ...stepperStyles, ...stepperBlockStyles } : stepperStyles;

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        <form onSubmit={handleSubmit}>
          {this.renderContentForm({
            values,
            activeStep,
            onChange: handleChange,
            setFieldValue,
            intl,
            dataSource,
            ...this.props,
          })}
          <PillButtons
            leftButtonProps={leftButtonProps}
            rightButtonProps={{
              title: intl.formatMessage(messages.next),
              onClick: handleSubmit,
              disabled: !(values.file || dataSource.file),
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
        </form>
      </Fragment>
    );
  });

  render() {
    return <Container>{this.renderContent(!!this.props.values.id)}</Container>;
  }
}
