import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always, ifElse, isNil } from 'ramda';

import { Container, Element } from './counterHeader.styles';
import messages from './counterHeader.messages';

export const CounterHeader = ({ copy, count, right = null, moveToTop = false, customPlural }) => {
  const renderCopy = ifElse(
    isNil,
    always(<FormattedMessage values={{ copy, count }} {...messages.counter} />),
    always(<FormattedMessage values={{ copy, customPlural, count }} {...messages.customCounter} />)
  );

  return (
    <Container moveToTop={moveToTop}>
      <Element id="tagsCounter" renderElement={!!right} />
      {renderCopy(customPlural)}
      <Element renderElement={!!right}>{right}</Element>
    </Container>
  );
};

CounterHeader.propTypes = {
  copy: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  right: PropTypes.element,
  moveToTop: PropTypes.bool,
  customPlural: PropTypes.string,
};
