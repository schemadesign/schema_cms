import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './counterHeader.styles';
import messages from './counterHeader.messages';

export const CounterHeader = ({ copy, count }) => {
  return (
    <Container>
      <FormattedMessage values={{ copy, count }} {...messages.counter} />
    </Container>
  );
};

CounterHeader.propTypes = {
  copy: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};
