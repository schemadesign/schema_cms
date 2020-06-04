import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { pathOr, always } from 'ramda';
import { useIntl, FormattedMessage } from 'react-intl';

import messages from './blockElement.messages';
import { Error } from './blockElement.styles';
import { Uploader } from '../form/uploader';
import { getEventFiles, getValuePath } from '../../utils/helpers';
import { renderWhenTrue } from '../../utils/rendering';

const MAX_SIZE = 50 * 1024 * 1024;

export const FileElement = ({ blockPath, element, setFieldValue, accept = '*', index, ...restFormikProps }) => {
  const intl = useIntl();
  const [error, setError] = useState(false);
  const name = getValuePath({ blockPath, index });
  const handleUploadChange = data => {
    const uploadFile = getEventFiles(data);

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
        setFieldValue(`${name}.file`, result);
        setFieldValue(`${name}.fileName`, pathOr('', ['name'], file));
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

  return (
    <Fragment>
      <Uploader
        name={name}
        id={name}
        fileNames={pathOr('', ['value', 'fileName'], element)}
        onChange={handleUploadChange}
        accept={accept}
        label={intl.formatMessage(messages[element.type])}
        placeholder={intl.formatMessage(messages[`${element.type}Placeholder`])}
        {...restFormikProps}
      />
      {renderFileSizeError(error)}
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
