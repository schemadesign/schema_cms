import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, inputStyles, iconContainerStyles } from './checkbox.styles';
import CheckboxGroupContext from '../checkboxGroup/checkboxGroup.context';
import { EditIcon } from '../../icons/editIcon';

export class Checkbox extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    value: PropTypes.any.isRequired,
  };

  renderCheckboxIcon = ({ checked, checkedIcon, uncCheckedIcon }) => (checked ? checkedIcon : uncCheckedIcon);

  renderEditIcon = isEdit => (isEdit ? <EditIcon /> : null);

  render() {
    const { children, id, label, ...restProps } = this.props;

    return (
      <CheckboxGroupContext.Consumer>
        {({ name, onChange, value = [], isEdit, checkedIcon, uncCheckedIcon, customCheckboxStyles }) => {
          const checked = value.includes(restProps.value);
          const styles = { ...containerStyles, ...customCheckboxStyles };

          return (
            <div style={styles}>
              <input
                {...restProps}
                onChange={onChange}
                value={restProps.value}
                name={name}
                defaultChecked={checked}
                aria-hidden
                type="checkbox"
                id={id}
                style={inputStyles}
              />
              <span>{label}</span>
              <div style={iconContainerStyles}>
                {this.renderEditIcon(isEdit)}
                <label htmlFor={id}>{this.renderCheckboxIcon({ checked, checkedIcon, uncCheckedIcon })}</label>
              </div>
            </div>
          );
        }}
      </CheckboxGroupContext.Consumer>
    );
  }
}
