import React from 'react';
import PropTypes from 'prop-types';

import { HeaderItem, HeaderList, Header, HeaderIcon } from './cardHeader.styles';

export const CardHeader = ({ list, icon }) => {
  return (
    <Header>
      <HeaderList>
        {list.map((item, index) => (
          <HeaderItem id={`headerItem-${index}`} key={index}>
            {item}
          </HeaderItem>
        ))}
      </HeaderList>
      {icon ? <HeaderIcon>{icon}</HeaderIcon> : null}
    </Header>
  );
};

CardHeader.propTypes = {
  list: PropTypes.array.isRequired,
  icon: PropTypes.element,
};
