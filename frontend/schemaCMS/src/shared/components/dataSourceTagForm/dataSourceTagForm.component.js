import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { insert, is, remove } from 'ramda';
import { Form as FormUI, Icons } from 'schemaUI';

import { TextInput } from '../form/inputs/textInput';
import messages from './dataSourceTagForm.messages';
import { TAG_NAME, TAG_REMOVE_TAGS, TAG_TAGS } from '../../../modules/dataSourceTag/dataSourceTag.constants';
import { removeIconStyles, Tag } from './dataSourceTagForm.styles';
import { Link, LinkContainer } from '../../../theme/typography';

const { Label } = FormUI;
const { CloseIcon } = Icons;

export class DataSourceTagForm extends PureComponent {
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
    const insertIndex = is(Number, index) ? index : values[TAG_TAGS].length;
    const newValues = insert(insertIndex, { value: '' }, values[TAG_TAGS]);
    this.setState({ focusInputIndex: insertIndex });
    setFieldValue(TAG_TAGS, newValues);
  };

  handleRemoveTag = ({ index, byButton }) => {
    const { setFieldValue, values } = this.props;
    this.setState({ focusInputIndex: byButton ? null : index - 1 });
    const newValues = remove(index, 1, values[TAG_TAGS]);

    setFieldValue(TAG_TAGS, newValues);

    const removeId = values[TAG_TAGS][index].id;
    if (removeId) {
      setFieldValue(TAG_REMOVE_TAGS, values[TAG_REMOVE_TAGS].concat(removeId));
    }
  };

  handleBlur = ({ value }) => {
    const { setFieldValue, values } = this.props;
    this.setState({ focusInputIndex: null });
    if (!value.length) {
      setFieldValue(TAG_TAGS, values[TAG_TAGS].filter(({ value }) => value.length));
    }
  };

  handleKeyDown = ({ e, value, index }) => {
    const { setFieldValue, values } = this.props;

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
    setFieldValue(`${TAG_TAGS}.${index}`, { value, id: id || `create_${index}` });
  };

  render() {
    const { focusInputIndex } = this.state;
    const { handleChange, values, ...rest } = this.props;

    return (
      <Fragment>
        <TextInput
          value={values[TAG_NAME]}
          onChange={handleChange}
          name={TAG_NAME}
          fullWidth
          isEdit
          label={<FormattedMessage {...messages[TAG_NAME]} />}
          {...rest}
        />
        <div>
          <Label>{<FormattedMessage {...messages[TAG_TAGS]} />}</Label>
          {values[TAG_TAGS].map(({ value, id }, index) => (
            <Tag key={index}>
              <TextInput
                value={value}
                onChange={e => this.handleChange({ e, handleChange, id, index })}
                name={`${[TAG_TAGS]}.${index}`}
                fullWidth
                customStyles={{ paddingBottom: 0, width: '100%' }}
                isEdit
                inputRef={input => input && focusInputIndex === index && input.focus()}
                onFocus={() => this.setState({ focusInputIndex: index })}
                onBlur={() => this.handleBlur({ value })}
                onKeyDown={e => this.handleKeyDown({ value, e, index })}
                {...rest}
              />
              <CloseIcon
                customStyles={removeIconStyles}
                onClick={() => this.handleRemoveTag({ index, byButton: true })}
              />
            </Tag>
          ))}
        </div>
        <LinkContainer>
          <Link onClick={this.handleAddTag}>
            <FormattedMessage {...messages.addTag} />
          </Link>
        </LinkContainer>
      </Fragment>
    );
  }
}
