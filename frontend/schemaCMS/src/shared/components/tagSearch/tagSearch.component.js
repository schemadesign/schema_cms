import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always, defaultTo } from 'ramda';

import { Container, TagsContainer, NoTags } from './tagSearch.styles';
import messages from './tagSearch.messages';
import { renderWhenTrue } from '../../utils/rendering';
import { TagCategories } from './tagCategories.component';
import { LoadingWrapper } from '../loadingWrapper';

export const TagSearch = ({ tagCategories, values, setFieldValue, valuePath }) => {
  const renderNoTags = renderWhenTrue(
    always(
      <NoTags>
        <FormattedMessage {...messages.noTags} />
      </NoTags>
    )
  );

  return (
    <LoadingWrapper noData={!tagCategories.length} noDataContent={<FormattedMessage {...messages.noTags} />}>
      <Container>
        <TagsContainer>
          {tagCategories.map((item, index) => (
            <TagCategories
              key={index}
              selectedTags={defaultTo([], values[item.id])}
              setFieldValue={setFieldValue}
              valuePath={valuePath}
              {...item}
            />
          ))}
          {renderNoTags(!tagCategories.length)}
        </TagsContainer>
      </Container>
    </LoadingWrapper>
  );
};

TagSearch.propTypes = {
  tagCategories: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  valuePath: PropTypes.string,
};
