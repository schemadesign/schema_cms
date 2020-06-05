import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useTheme } from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';

import { TextInput } from '../form/inputs/textInput';
import { getCustomInputStyles, customStyles, editIconStyles, InputContainer, Label } from './blockElement.styles';
import messages from './blockElement.messages';
import { getValuePath } from '../../utils/helpers';
import { EMBED_VIDEO_TYPE, EMBED_VIDEO_ATTRIBUTES } from '../../../modules/blockTemplates/blockTemplates.constants';

const { EditIcon } = Icons;

export const EmbedVideoElement = ({ element, blockPath, handleChange, index, ...restFormikProps }) => {
  const intl = useIntl();

  return (
    <Fragment>
      <Label>
        <FormattedMessage {...messages[EMBED_VIDEO_TYPE]} />
      </Label>
      <InputContainer>
        <TextInput
          name={getValuePath({ blockPath, index })}
          value={element.value || ''}
          fullWidth
          customInputStyles={getCustomInputStyles(useTheme())}
          customStyles={customStyles}
          onChange={handleChange}
          debounceValue
          {...restFormikProps}
        />
        <EditIcon customStyles={editIconStyles} />
      </InputContainer>
      <Label>
        <FormattedMessage {...messages[EMBED_VIDEO_ATTRIBUTES]} />
      </Label>
      <InputContainer>
        <TextInput
          name={getValuePath({ blockPath, index, elementValue: `params.${EMBED_VIDEO_ATTRIBUTES}` })}
          value={element.params[EMBED_VIDEO_ATTRIBUTES] || ''}
          fullWidth
          placeholder={intl.formatMessage(messages[`${EMBED_VIDEO_ATTRIBUTES}Placeholder`])}
          customInputStyles={getCustomInputStyles(useTheme())}
          customStyles={customStyles}
          onChange={handleChange}
          debounceValue
          {...restFormikProps}
        />
        <EditIcon customStyles={editIconStyles} />
      </InputContainer>
    </Fragment>
  );
};

EmbedVideoElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
