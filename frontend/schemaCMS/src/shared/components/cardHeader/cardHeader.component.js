import React from 'react';
import PropTypes from 'prop-types';
import { always, not, isNil } from 'ramda';

import { HeaderItem, HeaderList, Header, HeaderIcon } from './cardHeader.styles';
import { renderWhenTrue } from '../../utils/rendering';

export const CardHeader = ({ list, icon }) => {
  const renderIcon = renderWhenTrue(always(<HeaderIcon>{icon}</HeaderIcon>));

  return (
    <Header>
      <HeaderList>
        {list.map((item, index) => (
          <HeaderItem id={`headerItem-${index}`} key={index}>
            {item}
          </HeaderItem>
        ))}
      </HeaderList>
      {renderIcon(not(isNil(icon)))}
    </Header>
  );
};

CardHeader.propTypes = {
  list: PropTypes.array.isRequired,
  icon: PropTypes.element,
};
