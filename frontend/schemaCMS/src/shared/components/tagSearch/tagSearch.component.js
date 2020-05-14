import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { asMutable } from 'seamless-immutable';

import { Container } from './tagSearch.styles';
import messages from './tagSearch.messages';
import { PAGE_TAG_CATEGORIES } from '../../../modules/page/page.constants';

const { Label } = Form;

export const TagCategories = ({ name, selectedTags, tags, setFieldValue, id }) => {
  const handleChange = selectedOption => setFieldValue(`${PAGE_TAG_CATEGORIES}.${id}`, selectedOption);
  const mutableTags = asMutable(tags);
  const options = mutableTags.map(({ value }) => ({ value, label: value }));

  return (
    <Fragment>
      <div>{name}</div>
      <Select value={selectedTags} onChange={handleChange} options={options} isMulti />
    </Fragment>
  );
};

TagCategories.propTypes = {
  name: PropTypes.string.isRequired,
  selectedTags: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export const TagSearch = ({ tagCategories, values, setFieldValue }) => {
  return (
    <Container>
      <Label>
        <FormattedMessage {...messages.tags} />
      </Label>
      {tagCategories.map((item, index) => (
        <TagCategories
          key={index}
          values={values}
          selectedTags={values[item.id] || []}
          setFieldValue={setFieldValue}
          {...item}
        />
      ))}
    </Container>
  );
};

TagSearch.propTypes = {
  tagCategories: PropTypes.array.isRequired,
  values: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
