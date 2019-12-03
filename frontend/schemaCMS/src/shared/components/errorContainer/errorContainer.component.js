import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { is, path } from 'ramda';

import { ERROR_TYPES, CODES, OTHER } from './errorContainer.constants';
import { Container } from './errorContainer.styles';
import messages from './errorContainer.messages';

export class ErrorContainer extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.bool]),
  };

  static defaultProps = {
    type: ERROR_TYPES.DEFAULT,
    error: null,
  };

  renderContent = error => {
    if (!error) {
      return null;
    }

    if (is(String, error)) {
      return error;
    }

    const code = path([0, 'code'], error);
    const updatedCode = CODES[code] || OTHER;

    return <FormattedMessage {...messages[updatedCode]} />;
  };

  render() {
    const { type, error, ...rest } = this.props;

    return (
      <Container type={type} {...rest}>
        {this.renderContent(error)}
      </Container>
    );
  }
}
