import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Stepper, Typography } from 'schemaUI';
import { always, cond, equals, ifElse, T } from 'ramda';

import { Container, StepperContainer, stepperStyles } from './view.styles';
import { Source } from './source';
import { PillButtons } from '../../../../shared/components/pillButtons';

const { H1, H2 } = Typography;

export class View extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    fetchDataSource: PropTypes.func.isRequired,
    unmountDataSource: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    activeStep: 1,
    steps: 6,
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

  handleBackClick = ifElse(equals(1), () => {}, () => this.handleStepChange(this.state.activeStep - 1));
  handleNextClick = ifElse(equals(this.state.steps), () => {}, () => this.handleStepChange(this.state.activeStep + 1));

  renderContent = cond([[equals(1), always(<Source dataSource={this.props.dataSource} />)], [T, always(null)]]);

  render() {
    const { activeStep, steps } = this.state;
    return (
      <Container>
        <Header>
          <H2>Create Data Source</H2>
          <H1>Source</H1>
        </Header>
        {this.renderContent(activeStep)}
        <PillButtons
          leftButtonTitle="Cancel"
          rightButtonTitle="Next"
          onLeftClick={() => this.handleBackClick(activeStep)}
          onRightClick={() => this.handleNextClick(activeStep)}
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
