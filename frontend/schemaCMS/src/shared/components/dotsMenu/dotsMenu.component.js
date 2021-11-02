import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';

import { Container, SelectContainer, IconContainer } from './dotsMenu.styles';

const { Select: SelectElement } = Form;
const { ThreeDotsIcon } = Icons;

export const DotsMenu = memo(
  ({ customStyles = null, options, centerIcon = false, iconContainerStyles, ...restProps }) => {
    const [open, setOpen] = useState(false);

    const index = 1;

    return (
      <Container customStyles={customStyles} onClick={() => setOpen(!open)}>
        <SelectContainer>
          <SelectElement options={options} open={open} setOpen={setOpen} {...restProps} />
        </SelectContainer>
        <IconContainer style={iconContainerStyles} centerIcon={centerIcon}>
          <ThreeDotsIcon id={`dots-menu-${index}`} />
        </IconContainer>
      </Container>
    );
  }
);

DotsMenu.propTypes = {
  customStyles: PropTypes.array,
  options: PropTypes.array.isRequired,
  centerIcon: PropTypes.bool,
  iconContainerStyles: PropTypes.object,
};
