import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { always, cond, equals, ifElse, T } from 'ramda';

import { Container, StepperContainer, stepperStyles } from './view.styles';
import messages from './view.messages';
import { Source } from './source';
import { PillButtons } from '../../../../shared/components/pillButtons';
import { renderWhenTrue } from '../../../../shared/utils/rendering';
import { TopHeader } from '../../../../shared/components/topHeader';

const MAX_STEPS = 6;
const INITIAL_STEP = 1;

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

  getHeaderAndMenuConfig = intl => ({
    headerTitle: intl.formatMessage(messages.title),
    headerSubtitle: intl.formatMessage(messages.subTitle),
  });

  handleStepChange = activeStep => this.setState({ activeStep });

  handleBackClick = () =>
    ifElse(equals(INITIAL_STEP), () => {}, () => this.handleStepChange(this.state.activeStep - 1));

  renderContentForm = ({ activeStep, ...props }) =>
    cond([[equals(INITIAL_STEP), always(<Source {...props} />)], [T, always(null)]])(activeStep);

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
    const topHeaderConfig = this.getHeaderAndMenuConfig(intl);
    const activeStep = parseInt(step, 10);

    return (
      <>
        <TopHeader {...topHeaderConfig} />
        <form onSubmit={handleSubmit}>
          {this.renderContentForm({ values, activeStep, onChange: handleChange, setFieldValue, intl, dataSource })}
          <PillButtons
            leftButtonTitle={intl.formatMessage(messages.back)}
            rightButtonTitle={intl.formatMessage(messages.next)}
            onLeftClick={this.handleBackClick}
            onRightClick={handleSubmit}
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
      </>
    );
  });

  render() {
    return <Container>{this.renderContent(!!this.props.values.id)}</Container>;
  }
}
