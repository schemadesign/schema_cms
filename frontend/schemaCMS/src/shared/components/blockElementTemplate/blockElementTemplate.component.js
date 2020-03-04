import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { Header, IconsContainer } from './blockElementTemplate.styles';
import { TextInput } from '../form/inputs/textInput';

const { EditIcon } = Icons;

export const BlockElementTemplate = memo(({ element: { name, type }, handleChange, ...restFormikProps }) => {
  return (
    <AccordionPanel>
      <AccordionHeader>
        <Header>
          <TextInput name={name} handleChange={handleChange} {...restFormikProps} autoWidth fullWidth />
          <IconsContainer>
            <EditIcon />
          </IconsContainer>
        </Header>
      </AccordionHeader>
      <AccordionDetails>{type}</AccordionDetails>
    </AccordionPanel>
  );
});

BlockElementTemplate.propTypes = {
  element: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};
