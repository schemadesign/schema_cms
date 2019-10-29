import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './stepper.styles';
import { withStyles } from '../styles/withStyles';

export class StepperComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customActiveDotStyles: PropTypes.object,
    customDotStyles: PropTypes.object,
    steps: PropTypes.number.isRequired,
    activeStep: PropTypes.number.isRequired,
    onStepChange: PropTypes.func,
  };

  static defaultProps = {
    customDotStyles: {},
    handleStep: () => {},
  };

  getActiveStyles = ({ step, activeStep, dotActiveStyles, customActiveDotStyles }) =>
    activeStep === step ? { ...dotActiveStyles, ...customActiveDotStyles } : {};

  renderDots = ({ steps, ...restProps }) =>
    [...Array(steps)].map((value, key) => this.renderDot({ key, ...restProps }));

  renderDot = ({ key, onStepChange, dotStyles, customDotStyles, ...restProps }) => (
    <span
      style={{ ...dotStyles, ...customDotStyles, ...this.getActiveStyles({ step: key + 1, ...restProps }) }}
      onClick={() => onStepChange(key + 1)}
      key={key}
    />
  );

  render = () => {
    const {
      customStyles,
      theme,
      activeStep,
      onStepChange,
      handleStep,
      customActiveDotStyles,
      customDotStyles,
      steps,
      ...restProps
    } = this.props;
    const { containerStyles, dotActiveStyles, dotStyles } = getStyles(theme);
    const customProps = {
      customStyles,
      theme,
      activeStep,
      onStepChange,
      handleStep,
      customActiveDotStyles,
      customDotStyles,
      steps,
      dotActiveStyles,
      dotStyles,
    };

    return (
      <div style={{ ...containerStyles, ...customStyles }} {...restProps}>
        {this.renderDots(customProps)}
      </div>
    );
  };
}

export const Stepper = withStyles(StepperComponent);
