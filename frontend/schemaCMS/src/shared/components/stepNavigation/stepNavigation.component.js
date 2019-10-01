import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { stepperStyles, stepperBlockStyles, StepperContainer } from './stepNavigation.styles';
import { BackButton, NavigationContainer, NextButton } from '../navigation';
import messages from './stepNavigation.messages';
import { INITIAL_STEP, MAX_STEPS, STATUS_DRAFT } from '../../../modules/dataSource/dataSource.constants';

export class StepNavigation extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    submitForm: PropTypes.func,
    dataSource: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  handleNextClick = submitForm => () => {
    if (submitForm) {
      return submitForm();
    }

    return this.handleStepChange(parseInt(this.props.match.params.step, 10) + 1);
  };

  handleStepChange = step => {
    const {
      history,
      dataSource,
      match: {
        params: { dataSourceId },
      },
    } = this.props;
    if (step < 1) {
      return this.props.history.push(`/project/${dataSource.project}/datasource`);
    }

    return history.push(`/datasource/${dataSourceId}/${step}`);
  };

  handleBackClick = () => this.handleStepChange(parseInt(this.props.match.params.step, 10) - 1);

  render() {
    const {
      loading,
      submitForm,
      match: {
        params: { step },
      },
      dataSource,
    } = this.props;
    const activeStep = parseInt(step, 10);
    const customStepperStyles =
      dataSource.status === STATUS_DRAFT ? { ...stepperStyles, ...stepperBlockStyles } : stepperStyles;

    return (
      <NavigationContainer>
        <BackButton onClick={this.handleBackClick} disabled={loading}>
          <FormattedMessage {...messages.back} values={{ cancel: activeStep === INITIAL_STEP }} />
        </BackButton>
        <NextButton onClick={this.handleNextClick(submitForm)} disabled={loading} loading={loading} />
        <StepperContainer>
          <Stepper
            activeStep={activeStep}
            steps={MAX_STEPS}
            customStyles={customStepperStyles}
            onStepChange={this.handleStepChange}
          />
        </StepperContainer>
      </NavigationContainer>
    );
  }
}
