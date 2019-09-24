import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './checkbox.styles';
import CheckboxGroupContext from '../checkboxGroup/checkboxGroup.context';
import { EditIcon } from '../../icons/editIcon';
import { withStyles } from '../../styles/withStyles';

export class CheckboxComponent extends PureComponent {
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
    const { id, children, isEdit, theme, ...restProps } = this.props;

    return (
      <CheckboxGroupContext.Consumer>
        {({ onChange, value = [], name, checkedIcon, uncCheckedIcon, customCheckboxStyles }) => {
          const checked = value.includes(restProps.value);
          const { containerStyles, inputStyles, iconContainerStyles, labelStyles, elementStyles } = getStyles(theme);
          const styles = { ...containerStyles, ...customCheckboxStyles };

          return (
            <div style={styles}>
              <input
                {...restProps}
                onChange={onChange}
                value={restProps.value}
                name={name}
                checked={checked}
                aria-hidden
                type="checkbox"
                id={id}
                style={inputStyles}
              />
              <span style={elementStyles}>{children}</span>
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

export const Checkbox = withStyles(CheckboxComponent);
