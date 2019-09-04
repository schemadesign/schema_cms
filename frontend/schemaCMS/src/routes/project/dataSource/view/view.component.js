import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Stepper, Typography } from 'schemaUI';
import { always, cond, equals, ifElse, T } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container, StepperContainer, stepperStyles } from './view.styles';
import messages from './view.messages';
import { Source } from './source';
import { PillButtons } from '../../../../shared/components/pillButtons';

const { H1, H2 } = Typography;
const MAX_STEPS = 6;
const INITIAL_STEP = 1;

export class View extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    fetchDataSource: PropTypes.func.isRequired,
    unmountDataSource: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    activeStep: INITIAL_STEP,
    steps: MAX_STEPS,
  };

  componentDidMount() {
    if (!this.props.dataSource.id) {
      const { projectId, dataSourceId } = this.props.match.params;

      this.props.fetchDataSource({ projectId, dataSourceId });
    }
  }

  componentWillUnmount() {
    this.props.unmountDataSource();
  }

  handleStepChange = activeStep => this.setState({ activeStep });

  handleBackClick = () =>
    ifElse(equals(INITIAL_STEP), () => {}, () => this.handleStepChange(this.state.activeStep - 1));
  handleNextClick = () =>
    ifElse(equals(this.state.steps), () => {}, () => this.handleStepChange(this.state.activeStep + 1));

  renderContent = cond([
    [equals(INITIAL_STEP), always(<Source dataSource={this.props.dataSource} />)],
    [T, always(null)],
  ]);

  render() {
    const { activeStep, steps } = this.state;
    const { intl } = this.props;
    return (
      <Container>
        <Header>
          <H2>
            <FormattedMessage {...messages.title} />
          </H2>
          <H1>
            <FormattedMessage {...messages.subTitle} />
          </H1>
        </Header>
        {this.renderContent(activeStep)}
        <PillButtons
          leftButtonTitle={intl.formatMessage(messages.back)}
          rightButtonTitle={intl.formatMessage(messages.next)}
          onLeftClick={this.handleBackClick}
          onRightClick={this.handleNextClick}
        />
        <StepperContainer>
          <Stepper
            activeStep={activeStep}
            steps={steps}
            customStyles={stepperStyles}
            onStepChange={this.handleStepChange}
          />
        </StepperContainer>
      </Container>
    );
  }
}
