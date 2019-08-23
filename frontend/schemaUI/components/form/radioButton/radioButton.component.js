import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { checkedStyles, containerStyles, inputStyles, labelStyles } from './radioButton.styles';
import RadioGroupContext from '../radioGroup/radioGroup.context';

export class RadioButton extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    label: PropTypes.string,
  };

  render() {
    const { children, label, ...restProps } = this.props;

    return (
      <RadioGroupContext.Consumer>
        {({ name, onChange, value, customLabelStyles = {}, customCheckedStyles = {} }) => {
          const checked = value === restProps.value;
          const labelCheckedStyles = checked ? { ...checkedStyles, ...customCheckedStyles } : {};
          const styles = { ...labelStyles, ...customLabelStyles, ...labelCheckedStyles };

          return (
            <div style={containerStyles}>
              <input
                {...restProps}
                onChange={onChange}
                value={restProps.value}
                name={name}
                defaultChecked={checked}
                aria-hidden
                type="radio"
                id={label}
                style={inputStyles}
              />
              <label htmlFor={label} style={styles}>
                {children}
              </label>
            </div>
          );
        }}
      </RadioGroupContext.Consumer>
    );
  }
}
