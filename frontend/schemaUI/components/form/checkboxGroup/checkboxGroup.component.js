import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckboxGroupContext from './checkboxGroup.context';
import { getStyles } from './checkboxGroup.styles';
import { CheckboxOnIcon } from '../../icons/checkboxOnIcon';
import { CheckboxOffIcon } from '../../icons/checkboxOffIcon';
import { withStyles } from '../../styles/withStyles';
import { filterAllowedAttributes } from '../../../utils/helpers';

class CheckboxGroupComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customCheckboxStyles: PropTypes.object,
    isEdit: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    checkedIcon: PropTypes.any,
    reverse: PropTypes.bool,
  };

  static defaultProps = {
    customStyles: {},
    customCheckboxStyles: {},
    reverse: false,
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
      reverse,
      ...restProps
    } = this.props;
    const context = { name, onChange, value, isEdit, checkedIcon, uncCheckedIcon, customCheckboxStyles, reverse };
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };
    const filteredProps = filterAllowedAttributes('div', restProps);

    return (
      <div style={styles} {...filteredProps}>
        <CheckboxGroupContext.Provider value={context}>{children}</CheckboxGroupContext.Provider>
      </div>
    );
  }
}

export const CheckboxGroup = withStyles(CheckboxGroupComponent);
