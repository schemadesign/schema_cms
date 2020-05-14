import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import Select, { components } from 'react-select';
import { asMutable } from 'seamless-immutable';
import { useTheme } from 'styled-components';
import { always } from 'ramda';

import { Container, Title, TagsContainer, getCustomSelectStyles, NoTags } from './tagSearch.styles';
import messages from './tagSearch.messages';
import { PAGE_TAGS } from '../../../modules/page/page.constants';
import { renderWhenTrue } from '../../utils/rendering';

const { Label } = Form;
const { CaretIcon } = Icons;

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretIcon />
    </components.DropdownIndicator>
  );
};

export const TagCategories = ({ name, selectedTags, tags, setFieldValue, id, customStyles }) => {
  const handleChange = selectedOption => setFieldValue(`${PAGE_TAGS}.${id}`, selectedOption);
  const mutableTags = asMutable(tags);
  const options = mutableTags.map(({ value }) => ({ value, label: value }));

  return (
    <Fragment>
      <Title>{name}</Title>
      <Select
        closeMenuOnSelect={false}
        components={{ DropdownIndicator }}
        styles={customStyles}
        value={selectedTags}
        onChange={handleChange}
        options={options}
        isMulti
      />
    </Fragment>
  );
};

TagCategories.propTypes = {
  name: PropTypes.string.isRequired,
  selectedTags: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  customStyles: PropTypes.object.isRequired,
};

export const TagSearch = ({ tagCategories, values, setFieldValue }) => {
  const theme = useTheme();
  const customStyles = getCustomSelectStyles(theme);
  const renderNoTags = renderWhenTrue(always(<NoTags>No tags available</NoTags>));

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
            selectedTags={values[item.id] || []}
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
  values: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
