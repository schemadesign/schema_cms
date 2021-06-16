import React from 'react';
import PropTypes from 'prop-types';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useIntl } from 'react-intl';
import { always } from 'ramda';

import { DetailsContainer, Header, IconContainer, customInputStyles } from './blockElement.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './blockElement.messages';
// eslint-disable-next-line import/no-cycle
import getElementComponent from '../../utils/getElement';
import { renderWhenTrueOtherwise } from '../../utils/rendering';
import { EditIconLabel } from '../form/frequentComponents.styles';

const { MinusIcon, EditIcon } = Icons;

export const BlockElement = props => {
  const { element, handleChange, index, blockPath, isAdmin, ...restFormikProps } = props;
  const elementPath = `${blockPath}.elements.${index}.name`;
  const intl = useIntl();
  const renderElementName = renderWhenTrueOtherwise(
    always(
      <TextInput
        name={elementPath}
        placeholder={intl.formatMessage(messages.elementNamePlaceholder)}
        onChange={handleChange}
        autoWidth
        fullWidth
        value={element.name}
        customInputStyles={customInputStyles}
        {...restFormikProps}
      />
    ),
    always(element.name)
  );

  return (
    <AccordionPanel id={element.id}>
      <AccordionHeader>
        <Header icons={2}>
          <IconContainer>
            <MinusIcon />
          </IconContainer>
          {renderElementName(isAdmin)}
          <IconContainer>
            {isAdmin ? (
              <EditIconLabel htmlFor={elementPath}>
                <EditIcon />
              </EditIconLabel>
            ) : null}
          </IconContainer>
        </Header>
      </AccordionHeader>
      <AccordionDetails>
        <DetailsContainer>{getElementComponent(props)}</DetailsContainer>
      </AccordionDetails>
    </AccordionPanel>
  );
};

BlockElement.propTypes = {
  handleChange: PropTypes.func.isRequired,
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
