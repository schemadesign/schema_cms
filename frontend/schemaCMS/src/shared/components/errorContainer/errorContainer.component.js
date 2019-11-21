import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { has, is } from 'ramda';

import { ERROR_TYPES, CODES, OTHER } from './errorContainer.constants';
import { Container } from './errorContainer.styles';
import messages from './errorContainer.messages';

export class ErrorContainer extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.element]),
  };

  static defaultProps = {
    type: ERROR_TYPES.DEFAULT,
  };

  renderContent = error => {
    if (!error) {
      return null;
    }

    if (is(Object, error) && has('code', error)) {
      const { code = OTHER } = error;
      const updatedCode = CODES[code] || OTHER;

      return <FormattedMessage {...messages[updatedCode]} />;
    }

    return error;
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
