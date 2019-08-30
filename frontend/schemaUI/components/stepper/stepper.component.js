import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, dotActiveStyles, dotStyles } from './stepper.styles';

export class Stepper extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customActiveDotStyles: PropTypes.object,
    customDotStyles: PropTypes.object,
    steps: PropTypes.number.isRequired,
    activeStep: PropTypes.number.isRequired,
    handleStep: PropTypes.func,
  };

  static defaultProps = {
    customDotStyles: {},
    handleStep: () => {},
  };

  getActiveStyles = step =>
    this.props.activeStep === step ? { ...dotActiveStyles, ...this.props.customActiveDotStyles } : {};

  renderDots = () => [...Array(this.props.steps)].map((value, key) => this.renderDot(key));

  renderDot = key => (
    <span
      style={{ ...dotStyles, ...this.props.customDotStyles, ...this.getActiveStyles(key + 1) }}
      onClick={() => this.props.handleStep(key + 1)}
      key={key}
    />
  );

  render = () => <div style={{ ...containerStyles, ...this.props.customStyles }}>{this.renderDots()}</div>;
}
