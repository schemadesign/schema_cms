import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import RadioGroupContext from './radioGroup.context';
import { containerStyles } from './radioGroup.styles';

export class RadioGroup extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customLabelStyles: PropTypes.object,
    customCheckedStyles: PropTypes.object,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
  };

  static defaultProps = {
    customStyles: {},
    customLabelStyles: {},
    customCheckedStyles: {},
  };

  render() {
    const { name, children, onChange, value, customLabelStyles, customCheckedStyles, customStyles } = this.props;
    const context = { name, onChange, value, customLabelStyles, customCheckedStyles };
    const styles = { ...containerStyles, ...customStyles };

    return (
      <div style={styles}>
        <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
      </div>
    );
  }
}
