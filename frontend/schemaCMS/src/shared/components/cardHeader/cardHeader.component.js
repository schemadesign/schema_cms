import React from 'react';
import PropTypes from 'prop-types';

import { HeaderItem, HeaderList } from './cardHeader.styles';

export const CardHeader = ({ list }) => {
  return (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem id={`headerItem-${index}`} key={index}>
          {item}
        </HeaderItem>
      ))}
    </HeaderList>
  );
};

CardHeader.propTypes = {
  list: PropTypes.array.isRequired,
};
