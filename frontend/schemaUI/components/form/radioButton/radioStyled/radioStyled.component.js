import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './radioStyled.styles';
import { RadioBaseComponent } from '../radioBase/radioBase.component';
import { withStyles } from '../../../styles/withStyles';

export class RadioStyledComponent extends PureComponent {
  static propTypes = {
    selectedValue: PropTypes.string,
    value: PropTypes.string,
    theme: PropTypes.object,
  };

  render() {
    const { selectedValue, theme, ...restProps } = this.props;
    const { radioStyles, checkedRadioStyles, unCheckedRadioStyles } = getStyles(theme);

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

export const RadioStyled = withStyles(RadioStyledComponent);
