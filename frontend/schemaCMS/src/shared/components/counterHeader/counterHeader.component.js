import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container, Element } from './counterHeader.styles';
import messages from './counterHeader.messages';

export const CounterHeader = ({ copy, count, right = null }) => {
  return (
    <Container>
      <Element renderElement={!!right} />
      <FormattedMessage values={{ copy, count }} {...messages.counter} />
      <Element renderElement={!!right}>{right}</Element>
    </Container>
  );
};

CounterHeader.propTypes = {
  copy: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  right: PropTypes.element,
};
