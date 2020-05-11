import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { always, insert, is, remove, path } from 'ramda';
import { Form as FormUI, Icons } from 'schemaUI';

import { TextInput } from '../form/inputs/textInput';
import messages from './tagCategoryForm.messages';
import {
  TAG_CATEGORY_IS_PUBLIC,
  TAG_CATEGORY_IS_SINGLE_SELECT,
  TAG_CATEGORY_NAME,
  TAG_CATEGORY_REMOVE_TAGS,
  TAG_CATEGORY_TAGS,
} from '../../../modules/tagCategory/tagCategory.constants';
import {
  removeIconStyles,
  Tag,
  TagsContainer,
  AddNewTagContainer,
  Switches,
  Error,
  TagContainer,
} from './tagCategoryForm.styles';
import {
  AvailableCopy,
  mobilePlusStyles,
  PlusContainer,
  SwitchContainer,
  SwitchCopy,
  SwitchLabel,
} from '../form/frequentComponents.styles';
import { CounterHeader } from '../counterHeader';
import { PlusButton } from '../navigation';
import { renderWhenTrue } from '../../utils/rendering';

const { TextField, Switch } = FormUI;
const { CloseIcon } = Icons;

export const TagComponent = ({
  value,
  values,
  id,
  index,
  setFieldValue,
  handleAddTag,
  focusInputIndex,
  setFocusInputIndex,
  ...restFormikProps
}) => {
  const handleTagChange = ({ e, id = null, index }) => {
    const { value } = e.target;
    const tag = id ? { value, id } : { value };
    setFieldValue(`${TAG_CATEGORY_TAGS}.${index}`, tag);
  };
  const handleRemoveTag = ({ index, resetIndex }) => {
    setFocusInputIndex(resetIndex ? null : index - 1);
    const newValues = remove(index, 1, values[TAG_CATEGORY_TAGS]);
    setFieldValue(TAG_CATEGORY_TAGS, newValues);
    const removeId = values[TAG_CATEGORY_TAGS][index].id;

    if (is(Number, removeId)) {
      const removeTags = values[TAG_CATEGORY_REMOVE_TAGS] || [];
      setFieldValue(TAG_CATEGORY_REMOVE_TAGS, removeTags.concat(removeId));
    }

    setTimeout(() => restFormikProps.validateForm());
  };
  const handleBlur = index => e => {
    const { value } = e.target;

    if (!value.length) {
      return handleRemoveTag({ index, resetIndex: true });
    }

    return setFocusInputIndex(null);
  };
  const handleKeyDown = index => e => {
    const { value } = e.target;

    if (e.keyCode === 13) {
      e.preventDefault();
      if (value.length) {
        handleAddTag({ index: index + 1 });
      }
    }

    if (!value.length) {
      if (e.keyCode === 8) {
        e.preventDefault();
        handleRemoveTag({ setFieldValue, values, index });
      }
    }
  };
  const error = path(['errors', TAG_CATEGORY_TAGS, index, 'value'], restFormikProps);
  const renderError = error => renderWhenTrue(always(<Error>{error}</Error>))(!!error);

  return (
    <TagContainer>
      <Tag>
        <TextField
          value={value}
          onChange={e => handleTagChange({ e, id, index })}
          name={`${[TAG_CATEGORY_TAGS]}.${index}`}
          fullWidth
          customStyles={{ paddingBottom: 0, width: '100%' }}
          isEdit
          inputRef={input => input && focusInputIndex === index && input.focus()}
          onFocus={() => setFocusInputIndex(index)}
          onBlur={handleBlur(index)}
          onKeyDown={handleKeyDown(index)}
          {...restFormikProps}
        />
        <CloseIcon customStyles={removeIconStyles} onClick={() => handleRemoveTag({ index, resetIndex: true })} />
      </Tag>
      {renderError(error)}
    </TagContainer>
  );
};

TagComponent.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  handleAddTag: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  id: PropTypes.number,
  index: PropTypes.number.isRequired,
  focusInputIndex: PropTypes.number,
  setFocusInputIndex: PropTypes.func.isRequired,
};

export const TagCategoryForm = ({ setFieldValue, values, handleChange, ...restFormikProps }) => {
  const [focusInputIndex, setFocusInputIndex] = useState(null);
  const intl = useIntl();
  const handleAddTag = ({ index }) => {
    const insertIndex = is(Number, index) ? index : values[TAG_CATEGORY_TAGS].length;
    const newValues = insert(insertIndex, { value: '' }, values[TAG_CATEGORY_TAGS]);
    setFocusInputIndex(insertIndex);
    setFieldValue(TAG_CATEGORY_TAGS, newValues);
  };

  return (
    <Fragment>
      <TextInput
        value={values[TAG_CATEGORY_NAME]}
        onChange={handleChange}
        name={TAG_CATEGORY_NAME}
        fullWidth
        isEdit
        label={<FormattedMessage {...messages[TAG_CATEGORY_NAME]} />}
        {...restFormikProps}
      />
      <Switches>
        <SwitchContainer>
          <Switch value={values[TAG_CATEGORY_IS_PUBLIC]} id={TAG_CATEGORY_IS_PUBLIC} onChange={handleChange} />
          <SwitchCopy>
            <SwitchLabel htmlFor={TAG_CATEGORY_IS_PUBLIC}>
              <FormattedMessage {...messages[TAG_CATEGORY_IS_PUBLIC]} />
            </SwitchLabel>
            <AvailableCopy>
              <FormattedMessage
                {...messages.tagCategoryAvailability}
                values={{
                  availability: intl.formatMessage(
                    messages[values[TAG_CATEGORY_IS_PUBLIC] ? 'publicCopy' : 'privateCopy']
                  ),
                }}
              />
            </AvailableCopy>
          </SwitchCopy>
        </SwitchContainer>
        <SwitchContainer>
          <Switch
            value={values[TAG_CATEGORY_IS_SINGLE_SELECT]}
            id={TAG_CATEGORY_IS_SINGLE_SELECT}
            onChange={handleChange}
          />
          <SwitchCopy>
            <SwitchLabel htmlFor={TAG_CATEGORY_IS_SINGLE_SELECT}>
              <FormattedMessage {...messages[TAG_CATEGORY_IS_SINGLE_SELECT]} />
            </SwitchLabel>
            <AvailableCopy>
              <FormattedMessage
                {...messages.tagCategorySingleChoice}
                values={{
                  type: intl.formatMessage(
                    messages[values[TAG_CATEGORY_IS_SINGLE_SELECT] ? 'singleChoice' : 'multiChoice']
                  ),
                }}
              />
            </AvailableCopy>
          </SwitchCopy>
        </SwitchContainer>
      </Switches>
      <CounterHeader
        copy={intl.formatMessage(messages[TAG_CATEGORY_TAGS])}
        count={values[TAG_CATEGORY_TAGS].length}
        right={
          <PlusContainer>
            <PlusButton customStyles={mobilePlusStyles} onClick={handleAddTag} type="button" />
          </PlusContainer>
        }
      />
      <TagsContainer>
        {values[TAG_CATEGORY_TAGS].map((item, index) => (
          <TagComponent
            setFieldValue={setFieldValue}
            handleAddTag={handleAddTag}
            values={values}
            focusInputIndex={focusInputIndex}
            setFocusInputIndex={setFocusInputIndex}
            index={index}
            key={index}
            {...item}
            {...restFormikProps}
          />
        ))}
      </TagsContainer>
      <AddNewTagContainer onClick={handleAddTag}>
        <FormattedMessage {...messages.addNewTag} />
      </AddNewTagContainer>
    </Fragment>
  );
};

TagCategoryForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};
