import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'schemaUI';

export const BlockStackElement = ({ element: { value = [] } }) => <Accordion>{value}</Accordion>;

BlockStackElement.propTypes = {
  element: PropTypes.object.isRequired,
};
