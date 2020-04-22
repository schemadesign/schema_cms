import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useDebounce } from 'react-use';

import { getValuePath } from '../../utils/helpers';
import { MarkdownContainer } from './blockElement.styles';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

export const MarkdownElement = ({ element, blockPath, setFieldValue, index }) => {
  const [value, setValue] = useState(element.value);
  const [selectedTab, setSelectedTab] = useState('write');
  const name = getValuePath({ blockPath, index });

  useDebounce(
    () => {
      setFieldValue(name, value);
    },
    200,
    [value]
  );

  return (
    <MarkdownContainer>
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
      />
    </MarkdownContainer>
  );
};

MarkdownElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
