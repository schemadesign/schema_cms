import React from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { useIntl } from 'react-intl';

import messages from './blockElement.messages';
import { Uploader } from '../form/uploader';
import { getEventFiles, getValuePath } from '../../utils/helpers';
import { IMAGE_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';

export const ImageElement = ({ blockPath, element, setFieldValue, index, ...restFormikProps }) => {
  const intl = useIntl();
  const name = getValuePath({ blockPath, index });
  const handleUploadChange = data => {
    const uploadFile = getEventFiles(data);

    if (!uploadFile.length) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(uploadFile[0]);

    reader.addEventListener(
      'load',
      ({ target: { result } }) => {
        setFieldValue(`${name}.file`, result);
        setFieldValue(`${name}.fileName`, pathOr('', ['name'], uploadFile[0]));
      },
      false
    );
  };

  return (
    <Uploader
      name={name}
      id={name}
      fileNames={pathOr('', ['value', 'fileName'], element)}
      onChange={handleUploadChange}
      accept=".png, .jpg, .jpeg, .gif"
      label={intl.formatMessage(messages[IMAGE_TYPE])}
      placeholder={intl.formatMessage(messages[`${IMAGE_TYPE}Placeholder`])}
      {...restFormikProps}
    />
  );
};

ImageElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
