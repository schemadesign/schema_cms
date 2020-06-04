import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useTheme } from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { TextInput } from '../form/inputs/textInput';
import { getCustomInputStyles, customStyles, editIconStyles, InputContainer, Label } from './blockElement.styles';
import messages from './blockElement.messages';
import { getValuePath } from '../../utils/helpers';
import {
  EMBED_VIDEO_URL,
  EMBED_VIDEO_HEIGHT,
  EMBED_VIDEO_WIDTH,
} from '../../../modules/blockTemplates/blockTemplates.constants';

const { EditIcon } = Icons;

export const EmbedVideoElement = ({ element, blockPath, handleChange, index, ...restFormikProps }) => (
  <Fragment>
    <Label>
      <FormattedMessage {...messages[EMBED_VIDEO_URL]} />
    </Label>
    <InputContainer>
      <TextInput
        name={getValuePath({ blockPath, index })}
        value={element.value[EMBED_VIDEO_URL] || ''}
        fullWidth
        customInputStyles={getCustomInputStyles(useTheme())}
        customStyles={customStyles}
        onChange={handleChange}
        multiline
        {...restFormikProps}
      />
      <EditIcon customStyles={editIconStyles} />
    </InputContainer>
    <Label>
      <FormattedMessage {...messages[EMBED_VIDEO_HEIGHT]} />
    </Label>
    <InputContainer>
      <TextInput
        name={getValuePath({ blockPath, index })}
        value={element.value[EMBED_VIDEO_HEIGHT] || ''}
        fullWidth
        customInputStyles={getCustomInputStyles(useTheme())}
        customStyles={customStyles}
        onChange={handleChange}
        multiline
        {...restFormikProps}
      />
      <EditIcon customStyles={editIconStyles} />
    </InputContainer>
    <Label>
      <FormattedMessage {...messages[EMBED_VIDEO_WIDTH]} />
    </Label>
    <InputContainer>
      <TextInput
        name={getValuePath({ blockPath, index })}
        value={element.value[EMBED_VIDEO_WIDTH] || ''}
        fullWidth
        customInputStyles={getCustomInputStyles(useTheme())}
        customStyles={customStyles}
        onChange={handleChange}
        multiline
        {...restFormikProps}
      />
      <EditIcon customStyles={editIconStyles} />
    </InputContainer>
  </Fragment>
);

EmbedVideoElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
