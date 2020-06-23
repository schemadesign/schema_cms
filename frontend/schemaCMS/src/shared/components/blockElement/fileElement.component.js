import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { pathOr, always } from 'ramda';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { Icons } from 'schemaUI';

import messages from './blockElement.messages';
import {
  Error,
  customStyles,
  InputContainer,
  getCustomInputStyles,
  editIconStyles,
  Label,
} from './blockElement.styles';
import { Uploader } from '../form/uploader';
import { getEventFiles, getValuePath } from '../../utils/helpers';
import { renderWhenTrue } from '../../utils/rendering';
import { IMAGE_TYPE, ELEMENT_PARAMS } from '../../../modules/blockTemplates/blockTemplates.constants';
import { TextInput } from '../form/inputs/textInput';
import { FILE, FILE_NAME, FILE_ALT } from '../../../modules/page/page.constants';

const MAX_SIZE = 50 * 1024 * 1024;
const { EditIcon } = Icons;

export const FileElement = ({
  blockPath,
  handleChange,
  element,
  setFieldValue,
  accept = '*',
  index,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const [error, setError] = useState(false);
  const name = getValuePath({ blockPath, index });
  const altValue = pathOr('', [ELEMENT_PARAMS, FILE_ALT], element);
  const altPath = getValuePath({ blockPath, index, elementValue: `${ELEMENT_PARAMS}.${FILE_ALT}` });
  const handleUploadChange = data => {
    const uploadFile = getEventFiles(data);

    if (!uploadFile) {
      setFieldValue(name, {});
      return;
    }

    if (!uploadFile.length) {
      return;
    }

    const file = uploadFile[0];

    if (MAX_SIZE < file.size) {
      setError(true);
      return;
    }

    setError(false);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener(
      'load',
      ({ target: { result } }) => {
        setFieldValue(`${name}.${FILE}`, result);
        setFieldValue(`${name}.${FILE_NAME}`, pathOr('', ['name'], file));
      },
      false
    );
  };

  const renderFileSizeError = error =>
    renderWhenTrue(
      always(
        <Error>
          <FormattedMessage {...messages.fileSizeError} values={{ type: intl.formatMessage(messages[element.type]) }} />
        </Error>
      )
    )(error);

  const renderAlt = renderWhenTrue(
    always(
      <Fragment>
        <Label>
          <FormattedMessage {...messages[FILE_ALT]} />
        </Label>
        <InputContainer>
          <TextInput
            name={altPath}
            value={altValue}
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
    )
  );

  return (
    <Fragment>
      <Uploader
        name={name}
        id={name}
        fileNames={pathOr('', ['value', FILE_NAME], element)}
        onChange={handleUploadChange}
        accept={accept}
        label={intl.formatMessage(messages[element.type])}
        placeholder={intl.formatMessage(messages[`${element.type}Placeholder`])}
        isRemovable
        {...restFormikProps}
      />
      {renderFileSizeError(error)}
      {renderAlt(element.type === IMAGE_TYPE)}
    </Fragment>
  );
};

FileElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  accept: PropTypes.string,
};
