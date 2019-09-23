import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckboxGroupContext from './checkboxGroup.context';
import { getStyles } from './checkboxGroup.styles';
import { CheckboxOnIcon } from '../../icons/checkboxOnIcon';
import { CheckboxOffIcon } from '../../icons/checkboxOffIcon';
import { withStyles } from '../../styles/withStyles';

export class CheckboxGroupComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customCheckboxStyles: PropTypes.object,
    isEdit: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    checkedIcon: PropTypes.any,
  };

  static defaultProps = {
    customStyles: {},
    customCheckboxStyles: {},
    checkedIcon: <CheckboxOnIcon />,
    uncCheckedIcon: <CheckboxOffIcon />,
  };

  render() {
    const {
      name,
      children,
      onChange,
      value,
      customStyles,
      isEdit,
      checkedIcon,
      uncCheckedIcon,
      customCheckboxStyles,
      theme,
    } = this.props;
    const context = { name, onChange, value, isEdit, checkedIcon, uncCheckedIcon, customCheckboxStyles };
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return (
      <div style={styles}>
        <CheckboxGroupContext.Provider value={context}>{children}</CheckboxGroupContext.Provider>
      </div>
    );
  }
}

export const CheckboxGroup = withStyles(CheckboxGroupComponent);
