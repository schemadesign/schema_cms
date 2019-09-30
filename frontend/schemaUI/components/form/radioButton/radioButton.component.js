import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RadioGroupContext from '../radioGroup/radioGroup.context';
import { getStyles } from './radioButton.styles';
import { withStyles } from '../../styles/withStyles';

export class RadioButtonComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    value: PropTypes.any.isRequired,
  };

  renderAdditionalText = label => label || null;

  render() {
    const { children, id, label, theme, ...restProps } = this.props;
    const { containerStyles, inputStyles, labelStyles } = getStyles(theme);

    return (
      <RadioGroupContext.Consumer>
        {({ name, onChange, value, customLabelStyles = {}, customCheckedStyles = {} }) => {
          const checked = value === restProps.value;
          const labelCheckedStyles = checked ? customCheckedStyles : {};
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
                id={id}
                style={inputStyles}
              />
              <label htmlFor={id} style={styles}>
                {children}
              </label>
              {this.renderAdditionalText(label)}
            </div>
          );
        }}
      </RadioGroupContext.Consumer>
    );
  }
}

export const RadioButton = withStyles(RadioButtonComponent);
