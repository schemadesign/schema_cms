import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { always, equals, ifElse, insert, is, pick, remove } from 'ramda';
import { Form as FormUI, Icons } from 'schemaUI';

import { TextInput } from '../form/inputs/textInput';
import messages from './dataSourceTagForm.messages';
import {
  INITIAL_VALUES,
  TAG_NAME,
  TAG_REMOVE_TAGS,
  TAG_TAGS,
  TAGS_SCHEMA,
} from '../../../modules/dataSourceTag/dataSourceTag.constants';
import { Form, Tag, removeIconStyles } from './dataSourceTagForm.styles';
import { BackButton, NavigationContainer, NextButton } from '../navigation';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';
import { TAGS_PAGE } from '../../../modules/dataSource/dataSource.constants';
import { Link, LinkContainer } from '../../../theme/typography';
import { renderWhenTrue } from '../../utils/rendering';
import { errorMessageParser } from '../../utils/helpers';
import reportError from '../../utils/reportError';

const { Label } = FormUI;
const { CloseIcon } = Icons;

export class DataSourceTagForm extends PureComponent {
  static propTypes = {
    createTag: PropTypes.func,
    updateTag: PropTypes.func,
    removeTag: PropTypes.func,
    tag: PropTypes.object,
    dataSourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    tag: {},
  };

  state = {
    confirmationModalOpen: false,
    removeLoading: false,
    focusInputIndex: null,
  };

  getBackMessageId = ifElse(equals(true), always('cancel'), always('back'));

  handleRemoveList = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleBack = () => this.props.history.push(`/datasource/${this.props.dataSourceId}/${TAGS_PAGE}`);

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });

      const { datasource, id: tagId } = this.props.tag;
      await this.props.removeTag({ dataSourceId: datasource.id, tagId });
    } catch (error) {
      this.setState({ removeLoading: false });
      reportError(error);
    }
  };

  handleSubmit = async (formData, { setErrors, setSubmitting }) => {
    const submitFunc = this.props.createTag || this.props.updateTag;
    const dataSourceId = this.props.dataSourceId;

    try {
      setSubmitting(true);
      await submitFunc({ dataSourceId, tagId: this.props.tag.id, formData });
    } catch (errors) {
      const { formatMessage } = this.props.intl;
      const errorMessages = errorMessageParser({ errors, messages, formatMessage });

      setErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  handleAddTag = ({ setFieldValue, values, index }) => {
    const insertIndex = is(Number, index) ? index : values[TAG_TAGS].length;
    const newValues = insert(insertIndex, { value: '' }, values[TAG_TAGS]);
    this.setState({ focusInputIndex: insertIndex });
    setFieldValue(TAG_TAGS, newValues);
  };

  handleRemoveTag = ({ setFieldValue, values, index, byButton }) => {
    this.setState({ focusInputIndex: byButton ? null : index - 1 });
    const newValues = remove(index, 1, values[TAG_TAGS]);

    setFieldValue(TAG_TAGS, newValues);

    const removeId = values[TAG_TAGS][index].id;
    if (removeId) {
      setFieldValue(TAG_REMOVE_TAGS, values[TAG_REMOVE_TAGS].concat(removeId));
    }
  };

  handleBlur = ({ setFieldValue, values, value }) => {
    if (!value.length) {
      this.setState({ focusInputIndex: null });
      setFieldValue(TAG_TAGS, values[TAG_TAGS].filter(({ value }) => value.length));
    }
  };

  handleKeyDown = ({ e, setFieldValue, values, value, index }) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (value.length) {
        this.handleAddTag({ setFieldValue, values, index: index + 1 });
      }
    }

    if (!value.length) {
      if (e.keyCode === 8) {
        e.preventDefault();
        this.handleRemoveTag({ setFieldValue, values, index });
      }
    }
  };

  handleChange = ({ e, id = null, setFieldValue, index }) => {
    const { value } = e.target;
    setFieldValue(`${TAG_TAGS}.${index}`, id ? { value, id } : { value });
  };

  renderRemoveTagLink = renderWhenTrue(
    always(
      <Link onClick={this.handleRemoveList}>
        <FormattedMessage {...messages.deleteList} />
      </Link>
    )
  );

  render() {
    const { removeLoading, confirmationModalOpen, focusInputIndex } = this.state;
    const { tag } = this.props;
    const initialValues = {
      ...INITIAL_VALUES,
      ...pick([TAG_NAME, TAG_TAGS], tag),
    };

    return (
      <Fragment>
        <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={TAGS_SCHEMA}>
          {({ values, handleChange, dirty, isValid, isSubmitting, setFieldValue, ...rest }) => {
            return (
              <Form>
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
                        onChange={e => this.handleChange({ e, handleChange, id, setFieldValue, index })}
                        name={`${[TAG_TAGS]}.${index}`}
                        fullWidth
                        customStyles={{ paddingBottom: 0, width: '100%' }}
                        isEdit
                        inputRef={input => input && focusInputIndex === index && input.focus()}
                        onFocus={() => this.setState({ focusInputIndex: index })}
                        onBlur={() => this.handleBlur({ setFieldValue, values, value })}
                        onKeyDown={e => this.handleKeyDown({ value, values, setFieldValue, e, index })}
                        {...rest}
                      />
                      <CloseIcon
                        customStyles={removeIconStyles}
                        onClick={() => this.handleRemoveTag({ values, setFieldValue, index, byButton: true })}
                      />
                    </Tag>
                  ))}
                </div>
                <LinkContainer>
                  <Link onClick={() => this.handleAddTag({ values, setFieldValue })}>
                    <FormattedMessage {...messages.addTag} />
                  </Link>
                  {this.renderRemoveTagLink(!!this.props.tag.id)}
                </LinkContainer>
                <NavigationContainer fixed>
                  <BackButton onClick={this.handleBack} type="button">
                    <FormattedMessage {...messages[this.getBackMessageId(!this.props.tag.id)]} />
                  </BackButton>
                  <NextButton loading={isSubmitting} disabled={!dirty || !isValid || isSubmitting} type="submit">
                    <FormattedMessage {...messages.saveTag} />
                  </NextButton>
                </NavigationContainer>
              </Form>
            );
          }}
        </Formik>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove} disabled={removeLoading}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="confirmRemovalBtn"
              onClick={this.handleConfirmRemove}
              loading={removeLoading}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}
