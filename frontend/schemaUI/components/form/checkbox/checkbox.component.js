import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, inputStyles, iconContainerStyles, labelStyles } from './checkbox.styles';
import CheckboxGroupContext from '../checkboxGroup/checkboxGroup.context';
import { EditIcon } from '../../icons/editIcon';

export class Checkbox extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    value: PropTypes.any.isRequired,
    isEdit: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  renderCheckboxIcon = ({ checked, checkedIcon, uncCheckedIcon }) => (checked ? checkedIcon : uncCheckedIcon);

  renderEditIcon = isEdit => (isEdit ? <EditIcon /> : null);

  render() {
    const { id, children, isEdit, ...restProps } = this.props;

    return (
      <CheckboxGroupContext.Consumer>
        {({ onChange, value = [], checkedIcon, uncCheckedIcon, customCheckboxStyles }) => {
          const checked = value[restProps.value];
          const styles = { ...containerStyles, ...customCheckboxStyles };

          return (
            <div style={styles}>
              <input
                {...restProps}
                onChange={onChange}
                value={restProps.value}
                name={restProps.value}
                checked={checked}
                aria-hidden
                type="checkbox"
                id={id}
                style={inputStyles}
              />
              <span>{children}</span>
              <div style={iconContainerStyles}>
                {this.renderEditIcon(isEdit)}
                <label style={labelStyles} htmlFor={id}>
                  {this.renderCheckboxIcon({ checked, checkedIcon, uncCheckedIcon })}
                </label>
              </div>
            </div>
          );
        }}
      </CheckboxGroupContext.Consumer>
    );
  }
}
