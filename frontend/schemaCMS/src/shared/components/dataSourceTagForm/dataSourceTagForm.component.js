import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { always, equals, ifElse } from 'ramda';

import { TextInput } from '../form/inputs/textInput';
import messages from './dataSourceTagForm.messages';
import {
  TAG_KEY,
  TAG_VALUE,
  TAGS_SCHEMA,
  INITIAL_VALUES,
} from '../../../modules/dataSourceTag/dataSourceTag.constants';
import { Form } from './dataSourceTagForm.styles';
import { BackButton, NavigationContainer, NextButton } from '../navigation';
import { ModalActions, modalStyles, ModalTitle, Modal } from '../modal/modal.styles';
import { TAGS_PAGE } from '../../../modules/dataSource/dataSource.constants';
import { Link, LinkContainer } from '../../../theme/typography';
import { renderWhenTrue } from '../../utils/rendering';
import { errorMessageParser } from '../../utils/helpers';
import reportError from '../../utils/reportError';

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
  };

  getBackMessageId = ifElse(equals(true), always('cancel'), always('back'));

  handleRemoveTag = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleBack = () => this.props.history.push(`/datasource/${this.props.dataSourceId}/${TAGS_PAGE}`);

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });

      const { datasource, id: tagId } = this.props.tag;
      await this.props.removeTag({ dataSourceId: datasource.id, tagId });
    } catch (error) {
      reportError(error);
    } finally {
      this.setState({ removeLoading: false });
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

  renderRemoveTagLink = renderWhenTrue(
    always(
      <LinkContainer>
        <Link onClick={this.handleRemoveTag}>
          <FormattedMessage {...messages.deleteTag} />
        </Link>
      </LinkContainer>
    )
  );

  render() {
    const { removeLoading, confirmationModalOpen } = this.state;
    const initialValues = {
      ...INITIAL_VALUES,
      ...this.props.tag,
    };

    return (
      <Fragment>
        <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={TAGS_SCHEMA}>
          {({ values, handleChange, dirty, isValid, isSubmitting, ...rest }) => {
            return (
              <Form>
                <TextInput
                  value={values[TAG_KEY]}
                  onChange={handleChange}
                  name={TAG_KEY}
                  fullWidth
                  isEdit
                  label={<FormattedMessage {...messages[TAG_KEY]} />}
                  {...rest}
                />
                <TextInput
                  value={values[TAG_VALUE]}
                  onChange={handleChange}
                  name={TAG_VALUE}
                  fullWidth
                  isEdit
                  label={<FormattedMessage {...messages[TAG_VALUE]} />}
                  {...rest}
                />
                {this.renderRemoveTagLink(!!this.props.tag.id)}
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
