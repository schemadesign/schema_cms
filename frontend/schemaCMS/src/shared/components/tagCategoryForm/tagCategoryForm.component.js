import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always, insert, is, remove } from 'ramda';
import { Form as FormUI, Icons } from 'schemaUI';

import { TextInput } from '../form/inputs/textInput';
import messages from './tagCategoryForm.messages';
import {
  TAG_CATEGORY_NAME,
  TAG_CATEGORY_REMOVE_TAGS,
  TAG_CATEGORY_TAGS,
} from '../../../modules/tagCategory/tagCategory.constants';
import { removeIconStyles, Tag, TagsContainer, ButtonContainer, PlusButton } from './tagCategoryForm.styles';
import { renderWhenTrueOtherwise } from '../../utils/rendering';

const { Label, TextField } = FormUI;
const { CloseIcon, PlusIcon } = Icons;

export class TagCategoryForm extends PureComponent {
  static propTypes = {
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
  };

  state = {
    focusInputIndex: null,
  };

  handleAddTag = ({ index }) => {
    const { setFieldValue, values } = this.props;
    const insertIndex = is(Number, index) ? index : values[TAG_CATEGORY_TAGS].length;
    const newValues = insert(insertIndex, { value: '' }, values[TAG_CATEGORY_TAGS]);
    this.setState({ focusInputIndex: insertIndex });
    setFieldValue(TAG_CATEGORY_TAGS, newValues);
  };

  handleRemoveTag = ({ index, resetIndex }) => {
    const { setFieldValue, values } = this.props;
    this.setState({ focusInputIndex: resetIndex ? null : index - 1 });
    const newValues = remove(index, 1, values[TAG_CATEGORY_TAGS]);
    setFieldValue(TAG_CATEGORY_TAGS, newValues);
    const removeId = values[TAG_CATEGORY_TAGS][index].id;

    if (is(Number, removeId)) {
      setFieldValue(TAG_CATEGORY_REMOVE_TAGS, values[TAG_CATEGORY_REMOVE_TAGS].concat(removeId));
    }
  };

  handleBlur = index => e => {
    const { value } = e.target;

    if (!value.length) {
      return this.handleRemoveTag({ index, resetIndex: true });
    }

    return this.setState({ focusInputIndex: null });
  };

  handleKeyDown = index => e => {
    const { setFieldValue, values } = this.props;
    const { value } = e.target;

    if (e.keyCode === 13) {
      e.preventDefault();
      if (value.length) {
        this.handleAddTag({ index: index + 1 });
      }
    }

    if (!value.length) {
      if (e.keyCode === 8) {
        e.preventDefault();
        this.handleRemoveTag({ setFieldValue, values, index });
      }
    }
  };

  handleChange = ({ e, id = null, index }) => {
    const { setFieldValue } = this.props;
    const { value } = e.target;
    const tag = id ? { value, id } : { value };
    setFieldValue(`${TAG_CATEGORY_TAGS}.${index}`, tag);
  };

  renderTag = ({ value, id }, index) => (
    <Tag key={index}>
      <TextField
        value={value}
        onChange={e => this.handleChange({ e, id, index })}
        name={`${[TAG_CATEGORY_TAGS]}.${index}`}
        fullWidth
        customStyles={{ paddingBottom: 0, width: '100%' }}
        isEdit
        inputRef={input => input && this.state.focusInputIndex === index && input.focus()}
        onFocus={() => this.setState({ focusInputIndex: index })}
        onBlur={this.handleBlur(index)}
        onKeyDown={this.handleKeyDown(index)}
        {...this.props}
      />
      <CloseIcon customStyles={removeIconStyles} onClick={() => this.handleRemoveTag({ index, resetIndex: true })} />
    </Tag>
  );

  renderTags = tags =>
    renderWhenTrueOtherwise(always(<FormattedMessage {...messages.noTags} />), () => tags.map(this.renderTag))(
      !tags.length
    );

  render() {
    const { handleChange, values, ...rest } = this.props;

    return (
      <Fragment>
        <TextInput
          value={values[TAG_CATEGORY_NAME]}
          onChange={handleChange}
          name={TAG_CATEGORY_NAME}
          fullWidth
          isEdit
          label={<FormattedMessage {...messages[TAG_CATEGORY_NAME]} />}
          {...rest}
        />
        <Label>{<FormattedMessage {...messages[TAG_CATEGORY_TAGS]} />}</Label>
        <TagsContainer>{this.renderTags(values[TAG_CATEGORY_TAGS])}</TagsContainer>
        <ButtonContainer>
          <PlusButton onClick={this.handleAddTag} type="button" inverse>
            <PlusIcon inverse />
          </PlusButton>
        </ButtonContainer>
      </Fragment>
    );
  }
}