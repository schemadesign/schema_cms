import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';

import { PreviewLinkRoutines, selectMetaTags } from '../../../modules/previewLink';

import { Container } from './linkPreview.styles';

const { TextField } = Form;

export const LinkPreview = ({ onChange, placeholder, name = 'LINK-PREVIEW' }) => {
  const [value, setValue] = useState('');

  const dispatch = useDispatch();
  const fetchLink = () => dispatch(PreviewLinkRoutines.fetchLink(value));
  const metaTags = useSelector(selectMetaTags);

  useDebounce(
    () => {
      if (onChange) {
        return onChange(value);
      }

      return fetchLink();
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
