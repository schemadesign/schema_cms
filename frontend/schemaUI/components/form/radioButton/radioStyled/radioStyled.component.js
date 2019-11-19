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
    const { radioStyles, checkedRadioStyles, unCheckedRadioStyles } = getStyles(this.props.theme);
    const { selectedValue, ...restProps } = this.props;

    return (
      <RadioBaseComponent {...restProps}>
        <div style={radioStyles}>
          {restProps.value === selectedValue ? (
            <div style={checkedRadioStyles} />
          ) : (
            <div style={unCheckedRadioStyles} />
          )}
        </div>
      </RadioBaseComponent>
    );
  }
}
