import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './radioStyled.styles';
import { RadioBaseComponent } from '../radioBase/radioBase.component';

export class RadioStyled extends PureComponent {
  static propTypes = {
    selectedValue: PropTypes.string,
    value: PropTypes.string,
  };

  render() {
    const { radioStyles, checkedRadioStyles } = getStyles(this.props.theme);
    const { value, selectedValue } = this.props;

    return (
      <RadioBaseComponent {...this.props}>
        <div style={radioStyles}>{value === selectedValue ? <div style={checkedRadioStyles} /> : null}</div>
      </RadioBaseComponent>
    );
  }
}
