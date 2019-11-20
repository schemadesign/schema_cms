import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { always } from 'ramda';

import { stepperBlockStyles, StepperContainer, stepperStyles } from './stepNavigation.styles';
import { BackButton, NavigationContainer, NextButton } from '../navigation';
import messages from './stepNavigation.messages';
import { INITIAL_STEP, MAX_STEPS } from '../../../modules/dataSource/dataSource.constants';
import { renderWhenTrue } from '../../utils/rendering';

export class StepNavigation extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    disabled: PropTypes.shape({
      back: PropTypes.bool,
      next: PropTypes.bool,
    }),
    submitForm: PropTypes.func,
    dataSource: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  static defaultProps = {
    loading: false,
    disabled: {
      next: false,
      back: false,
    },
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
        params: { dataSourceId, projectId },
      },
    } = this.props;

    if (step < 1) {
      return this.props.history.push(`/project/${dataSource.project || projectId}/datasource`);
    }

    return history.push(`/datasource/${dataSourceId}/${step}`);
  };

  handleBackClick = () => this.handleStepChange(parseInt(this.props.match.params.step || INITIAL_STEP, 10) - 1);

  renderNextButton = ({ submitForm, nextDisabled, loading, activeStep }) =>
    renderWhenTrue(
      always(
        <NextButton onClick={this.handleNextClick(submitForm)} disabled={nextDisabled || loading} loading={loading} />
      )
    )(activeStep !== MAX_STEPS);

  render() {
    const {
      loading,
      disabled: { next: nextDisabled, back: backDisabled },
      submitForm,
      dataSource,
      match: {
        params: { step = INITIAL_STEP },
      },
    } = this.props;

    const activeStep = parseInt(step, 10);
    const customStepperStyles = dataSource.metaData ? stepperStyles : { ...stepperStyles, ...stepperBlockStyles };

    return (
      <NavigationContainer>
        <BackButton onClick={this.handleBackClick} disabled={backDisabled || loading}>
          <FormattedMessage {...messages.back} values={{ cancel: activeStep === INITIAL_STEP }} />
        </BackButton>
        {this.renderNextButton({ submitForm, nextDisabled, loading, activeStep })}
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
