import React from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';

import { useIntl } from 'react-intl';

import messages from './blockElement.messages';
import { Uploader } from '../form/uploader';
import { getEventFiles } from '../../utils/helpers';

export const ImageElement = ({ formikFieldPath: name, element, setFieldValue, ...restFormikProps }) => {
  const intl = useIntl();
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
      label={intl.formatMessage(messages.image)}
      placeholder={intl.formatMessage(messages.imagePlaceholder)}
      {...restFormikProps}
    />
  );
};
ImageElement.propTypes = {
  element: PropTypes.object.isRequired,
  formikFieldPath: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
