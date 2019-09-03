import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { always, cond, equals, T } from 'ramda';

import { Container, StepperContainer, stepperStyles } from './view.styles';
import { Source } from './source';

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

  renderContent = cond([[equals(1), always(<Source dataSource={this.props.dataSource} />)], [T, always(null)]]);

  render() {
    return (
      <Container>
        {this.renderContent(this.state.activeStep)}
        <StepperContainer>
          <Stepper
            activeStep={this.state.activeStep}
            steps={6}
            customStyles={stepperStyles}
            onStepChange={this.handleStepChange}
          />
        </StepperContainer>
      </Container>
    );
  }
}
