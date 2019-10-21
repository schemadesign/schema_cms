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

  getActiveStyles = (step, dotActiveStyles) =>
    this.props.activeStep === step ? { ...dotActiveStyles, ...this.props.customActiveDotStyles } : {};

  renderDots = (dotActiveStyles, dotStyles) =>
    [...Array(this.props.steps)].map((value, key) => this.renderDot(key, dotActiveStyles, dotStyles));

  renderDot = (key, dotActiveStyles, dotStyles) => (
    <span
      style={{ ...dotStyles, ...this.props.customDotStyles, ...this.getActiveStyles(key + 1, dotActiveStyles) }}
      onClick={() => this.props.onStepChange(key + 1)}
      key={key}
    />
  );

  render = () => {
    const { customStyles, theme, ...restProps } = this.props;
    const { containerStyles, dotActiveStyles, dotStyles } = getStyles(theme);

    return (
      <div style={{ ...containerStyles, ...customStyles }} {...restProps}>
        {this.renderDots(dotActiveStyles, dotStyles)}
      </div>
    );
  };
}

export const Stepper = withStyles(StepperComponent);
