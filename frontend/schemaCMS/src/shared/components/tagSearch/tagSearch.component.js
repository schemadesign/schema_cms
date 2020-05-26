import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { always, defaultTo } from 'ramda';

import { Container, TagsContainer, getCustomSelectStyles, NoTags } from './tagSearch.styles';
import messages from './tagSearch.messages';
import { renderWhenTrue } from '../../utils/rendering';
import { TagCategories } from './tagCategories.component';

export const TagSearch = ({ tagCategories, values, setFieldValue, valuePath }) => {
  const theme = useTheme();
  const customStyles = getCustomSelectStyles(theme);
  const renderNoTags = renderWhenTrue(
    always(
      <NoTags>
        <FormattedMessage {...messages.noTags} />
      </NoTags>
    )
  );

  return (
    <Container>
      <TagsContainer>
        {tagCategories.map((item, index) => (
          <TagCategories
            key={index}
            customStyles={customStyles}
            selectedTags={defaultTo([], values[item.id])}
            setFieldValue={setFieldValue}
            valuePath={valuePath}
            {...item}
          />
        ))}
        {renderNoTags(!tagCategories.length)}
      </TagsContainer>
    </Container>
  );
};

TagSearch.propTypes = {
  tagCategories: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  valuePath: PropTypes.string,
};
