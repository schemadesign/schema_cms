import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckboxGroupContext from './checkboxGroup.context';
import { containerStyles } from './checkboxGroup.styles';
import { CheckboxOnIcon } from '../../icons/checkboxOnIcon';
import { CheckboxOffIcon } from '../../icons/checkboxOffIcon';

export class CheckboxGroup extends PureComponent {
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
    } = this.props;
    const context = { name, onChange, value, isEdit, checkedIcon, uncCheckedIcon, customCheckboxStyles };
    const styles = { ...containerStyles, ...customStyles };

    return (
      <div style={styles}>
        <CheckboxGroupContext.Provider value={context}>{children}</CheckboxGroupContext.Provider>
      </div>
    );
  }
}
