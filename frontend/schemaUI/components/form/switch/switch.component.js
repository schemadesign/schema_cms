import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './switch.styles';
import { withStyles } from '../../styles/withStyles';
import { Label } from '../label';
import { filterAllowedAttributes } from '../../../utils/helpers';

export class SwitchComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {
    label: null,
    customStyles: {},
  };

  renderSwitch = ({ styles, circleStyles }) => (
    <div style={styles}>
      <div style={circleStyles} />
    </div>
  );

  renderSwitchWithoutLabel = ({ styles, id, circleStyles }) => (
    <label htmlFor={id}>{this.renderSwitch({ styles, circleStyles })}</label>
  );
  renderSwitchWithLabel = ({ styles, id, circleStyles, label, labelStyles }) => (
    <Label customStyles={labelStyles} name={id}>
      {label}
      {this.renderSwitch({ styles, circleStyles })}
    </Label>
  );

  render() {
    const { customStyles, theme, value, label, id, ...restProps } = this.props;
    const { switchStyles, circleStyles, labelStyles, inputStyles } = getStyles(theme, value);
    const styles = { ...switchStyles, ...customStyles };
    const renderContent = label ? this.renderSwitchWithLabel : this.renderSwitchWithoutLabel;
    const filteredProps = filterAllowedAttributes('input', restProps);

    return (
      <div>
        <input type="checkbox" id={id} checked={value} {...filteredProps} style={inputStyles} />
        {renderContent({ styles, circleStyles, label, labelStyles, id })}
      </div>
    );
  }
}

export const Switch = withStyles(SwitchComponent);
