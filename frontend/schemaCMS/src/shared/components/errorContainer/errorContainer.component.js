import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';

import { ERROR_TYPES } from './errorContainer.constants';
import { Container } from './errorContainer.styles';

export class ErrorContainer extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  static defaultProps = {
    type: ERROR_TYPES.DEFAULT,
  };

  render() {
    const {type, children, rest} = this.props;

    return <Container type={type} {...rest}>{children}</Container>;
  }
}
