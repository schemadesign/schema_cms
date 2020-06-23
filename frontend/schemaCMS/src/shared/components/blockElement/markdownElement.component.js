import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useDebounce } from 'react-use';
import { always, path, split } from 'ramda';
import MarkdownIt from 'markdown-it';
import MarkdownItFootnote from 'markdown-it-footnote';

import { getValuePath } from '../../utils/helpers';
import { MarkdownContainer, Error } from './blockElement.styles';
import { renderWhenTrue } from '../../utils/rendering';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});
md.use(MarkdownItFootnote);

export const MarkdownElement = ({ element, blockPath, setFieldValue, index, errors }) => {
  const [value, setValue] = useState(element.value);
  const [selectedTab, setSelectedTab] = useState('write');
  const name = getValuePath({ blockPath, index });
  const errorMessage = path(split('.', name), errors);

  useDebounce(
    () => {
      setFieldValue(name, value);
    },
    200,
    [value]
  );

  const renderError = error => renderWhenTrue(always(<Error>{error}</Error>))(!!error);

  return (
    <MarkdownContainer>
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={markdown => Promise.resolve(md.render(markdown))}
      />
      {renderError(errorMessage)}
    </MarkdownContainer>
  );
};

MarkdownElement.propTypes = {
  element: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
