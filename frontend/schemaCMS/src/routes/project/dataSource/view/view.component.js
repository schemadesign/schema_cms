import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { always, cond, equals, T } from 'ramda';

import { Container, StepperContainer, stepperStyles } from './view.styles';
import messages from './view.messages';
import { Source } from './source';
import { Fields } from './fields';
import { PillButtons } from '../../../../shared/components/pillButtons';
import { renderWhenTrue } from '../../../../shared/utils/rendering';
import { TopHeader } from '../../../../shared/components/topHeader';
import {
  STATUS_DRAFT,
  INITIAL_STEP,
  MAX_STEPS,
  FIELDS_STEP,
} from '../../../../modules/dataSource/dataSource.constants';

export class View extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
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

  state = { steps: MAX_STEPS };

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

    if (activeStep === FIELDS_STEP) {
      return {
        headerTitle,
        headerSubtitle: intl.formatMessage(messages.fields),
        secondaryMenuItems,
      };
    }

    return {
      headerTitle,
      headerSubtitle: intl.formatMessage(messages.source),
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
      [equals(1), always(<Source {...props} />)],
      [equals(2), always(<Fields {...props} />)],
      [equals(3), always(null)],
      [equals(4), always(null)],
      [equals(5), always(null)],
      [equals(6), always(null)],
      [T, always(null)],
    ])(activeStep);

  renderContent = renderWhenTrue(() => {
    const { steps } = this.state;
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
              steps={steps}
              customStyles={stepperStyles}
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
