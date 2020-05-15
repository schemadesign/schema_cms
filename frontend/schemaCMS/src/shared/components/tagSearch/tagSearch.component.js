import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { always, defaultTo } from 'ramda';

import { Container, TagsContainer, getCustomSelectStyles, NoTags } from './tagSearch.styles';
import messages from './tagSearch.messages';
import { renderWhenTrue } from '../../utils/rendering';
import { TagCategories } from './tagCategories.component';

const { Label } = Form;

export const TagSearch = ({ tagCategories, values, setFieldValue }) => {
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
      <Label>
        <FormattedMessage {...messages.tags} />
      </Label>
      <TagsContainer>
        {tagCategories.map((item, index) => (
          <TagCategories
            key={index}
            values={values}
            customStyles={customStyles}
            selectedTags={defaultTo([], values[item.id])}
            setFieldValue={setFieldValue}
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
};
