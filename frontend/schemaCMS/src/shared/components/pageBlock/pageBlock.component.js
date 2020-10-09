import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { Accordion, AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { always } from 'ramda';

import { Header, IconsContainer, Type, getCustomIconStyles, BlockName } from './pageBlock.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './pageBlock.messages';
import { BlockElement } from '../blockElement';
import { BLOCK_NAME, BLOCK_TYPE, BLOCK_ELEMENTS, BLOCK_ID, BLOCK_KEY } from '../../../modules/page/page.constants';
import { binStyles } from '../form/frequentComponents.styles';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';

const { EditIcon, BinIcon } = Icons;

export const PageBlock = ({
  index,
  block,
  pagerUrlOptions,
  formikFieldPath,
  draggableIcon,
  handleChange,
  removeBlock,
  isAdmin,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const blockPath = `${formikFieldPath}.${index}`;
  const blockName = `${blockPath}.${BLOCK_NAME}`;
  const renderBlockName = renderWhenTrueOtherwise(
    always(
      <TextInput
        name={blockName}
        placeholder={intl.formatMessage(messages.namePlaceholder)}
        onChange={handleChange}
        autoWidth
        fullWidth
        value={block[BLOCK_NAME]}
        {...restFormikProps}
      />
    ),
    always(<BlockName>{block[BLOCK_NAME]}</BlockName>)
  );
  const renderEditIcon = renderWhenTrue(always(<EditIcon />));
  const renderBinIcon = renderWhenTrue(
    always(<BinIcon id={blockPath} customStyles={binStyles} onClick={() => removeBlock(index)} />)
  );

  return (
    <AccordionPanel id={block[BLOCK_KEY] || block[BLOCK_ID]}>
      <AccordionHeader>
        <Header>
          <IconsContainer>{draggableIcon}</IconsContainer>
          {renderBlockName(isAdmin)}
          <IconsContainer>
            {renderEditIcon(isAdmin)}
            {renderBinIcon(!!removeBlock)}
          </IconsContainer>
        </Header>
        <Type title={block[BLOCK_TYPE]}>{block[BLOCK_TYPE]}</Type>
      </AccordionHeader>
      <AccordionDetails>
        <Accordion customIconStyles={getCustomIconStyles(theme)}>
          {block[BLOCK_ELEMENTS].map((element, index) => (
            <BlockElement
              key={index}
              index={index}
              isAdmin={isAdmin}
              blockPath={blockPath}
              element={element}
              handleChange={handleChange}
              pagerUrlOptions={pagerUrlOptions}
              {...restFormikProps}
            />
          ))}
        </Accordion>
      </AccordionDetails>
    </AccordionPanel>
  );
};

PageBlock.propTypes = {
  index: PropTypes.number.isRequired,
  block: PropTypes.object.isRequired,
  pagerUrlOptions: PropTypes.array.isRequired,
  draggableIcon: PropTypes.element,
  removeBlock: PropTypes.func,
  handleChange: PropTypes.func.isRequired,
  formikFieldPath: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
