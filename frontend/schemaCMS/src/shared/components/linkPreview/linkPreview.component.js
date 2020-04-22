import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';
import { useDebounce } from 'react-use';

import { Container } from './linkPreview.styles';
import { useLinkPreview } from '../../hooks/useLinkPreview.hook';

const { TextField } = Form;

export const LinkPreview = ({ onChange, placeholder, name = 'LINK-PREVIEW' }) => {
  const [value, setValue] = useState('');
  const [metaTags, fetchLink] = useLinkPreview();

  useDebounce(
    () => {
      if (onChange) {
        return onChange(value);
      }

      return fetchLink(value);
    },
    250,
    [value]
  );

  return (
    <Container>
      <TextField name={name} placeholder={placeholder} onChange={({ currentTarget: { value } }) => setValue(value)} />
      {metaTags ? metaTags.title : null}
    </Container>
  );
};

LinkPreview.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};
