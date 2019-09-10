import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { always, cond, equals, ifElse, T } from 'ramda';

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
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
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

    if (activeStep === FIELDS_STEP) {
      return {
        headerTitle,
        headerSubtitle: intl.formatMessage(messages.fields),
      };
    }

    return {
      headerTitle,
      headerSubtitle: intl.formatMessage(messages.source),
    };
  };

  handleStepChange = activeStep => this.setState({ activeStep });

  handleBackClick = () =>
    ifElse(equals(INITIAL_STEP), () => {}, () => this.handleStepChange(this.state.activeStep - 1));

  handleNextClick = () => {
    ifElse(equals(MAX_STEPS), () => {}, () => this.handleStepChange(this.state.activeStep + 1));
  };

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
            leftButtonProps={{
              title: intl.formatMessage(messages.back),
              onClick: this.handleBackClick,
            }}
            rightButtonProps={{
              title: intl.formatMessage(messages.next),
              // onClick: handleSubmit,
              onClick: this.handleNextClick,
              // disabled: !(values.file || dataSource.file),
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
