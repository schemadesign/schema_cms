import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, cond, equals, path, map, prop } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { modalStyles, Modal, ModalTitle, ModalActions } from '../modal/modal.styles';
import { BackButton, NextButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_CONTENT,
  BLOCK_IMAGES,
  BLOCK_IMAGE_NAMES,
  BLOCK_NAME,
  BLOCK_TYPE,
  CODE_TYPE,
  EMBED_TYPE,
  IMAGE_TYPE,
  MARKDOWN_TYPE,
  NONE,
  VALID_TYPE_OPTIONS,
} from '../../../modules/pageBlock/pageBlock.constants';
import messages from './pageBlockForm.messages';
import { Select } from '../form/select';
import { Uploader } from '../form/uploader';

export class PageBlockForm extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    initialValues: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  };

  state = {
    confirmationModalOpen: false,
    contentType: NONE,
    selectedStatus: null,
  };

  componentDidMount() {
    const type = path(['initialValues', 'type'], this.props);
    this.setState({ contentType: type });
  }

  getStatusOptions = intl =>
    VALID_TYPE_OPTIONS.map(status => ({
      value: status,
      label: intl.formatMessage(messages[status]),
    }));

  handleSelectStatus = ({ value: selectedStatus }) => {
    const { contentType } = this.state;

    if (contentType !== NONE && selectedStatus !== contentType) {
      this.setState({
        selectedStatus,
        confirmationModalOpen: true,
      });
    } else {
      this.props.setFieldValue(BLOCK_TYPE, selectedStatus);
    }
  };

  handleUploadChange = ({ files }) => {
    const { images, imageNames } = this.props.values;
    const updateNames = imageNames.concat(map(prop('name'), files));
    const updatedImages = images.concat([...files]);

    this.props.setFieldValue(BLOCK_IMAGES, updatedImages);
    this.props.setFieldValue(BLOCK_IMAGE_NAMES, updateNames);
  };

  handleRemoveItem = removeName => {
    const { images, imageNames } = this.props.values;
    const files = [...images].filter(({ name }) => name !== removeName);
    const names = imageNames.filter(name => name !== removeName);
    this.props.setFieldValue(BLOCK_IMAGES, files);
    this.props.setFieldValue(BLOCK_IMAGE_NAMES, names);
  };

  handleCancelTypeChange = () => {
    this.setState({
      confirmationModalOpen: false,
      selectedStatus: null,
    });
  };

  handleConfirmTypeChange = () => {
    const { selectedStatus } = this.state;

    this.props.setFieldValue(BLOCK_TYPE, selectedStatus);
    this.setState({
      confirmationModalOpen: false,
      selectedStatus: null,
      contentType: NONE,
    });
  };

  renderBlock = (messageId, messagePlaceholderId) => (
    <TextInput
      value={this.props.values[`${this.props.values[BLOCK_TYPE]}-${BLOCK_CONTENT}`]}
      name={`${this.props.values[BLOCK_TYPE]}-${BLOCK_CONTENT}`}
      label={this.props.intl.formatMessage(messages[messageId])}
      placeholder={this.props.intl.formatMessage(messages[messagePlaceholderId])}
      fullWidth
      multiline
      {...this.props}
      onChange={this.props.handleChange}
    />
  );

  renderImage = () => (
    <Uploader
      fileNames={this.props.values.imageNames}
      name={BLOCK_IMAGES}
      label={this.props.intl.formatMessage(messages.pageBlockFieldImage)}
      type="file"
      id="fileUpload"
      onChange={({ currentTarget }) => this.handleUploadChange(currentTarget)}
      onRemoveItem={this.handleRemoveItem}
      accept=".png, .jpg, .jpeg, .gif"
      checkOnlyErrors
      multiple
      {...this.props}
    />
  );

  renderBlockContent = cond([
    [equals(MARKDOWN_TYPE), () => this.renderBlock('pageBlockFieldMarkdown', 'pageBlockFieldMarkdownPlaceholder')],
    [equals(EMBED_TYPE), () => this.renderBlock('pageBlockFieldEmbed', 'pageBlockFieldEmbedPlaceholder')],
    [equals(CODE_TYPE), () => this.renderBlock('pageBlockFieldCode', 'pageBlockFieldCodePlaceholder')],
    [equals(IMAGE_TYPE), this.renderImage],
    [equals(NONE), always(null)],
  ]);

  render() {
    const { confirmationModalOpen } = this.state;
    const { values, intl, handleChange, ...restProps } = this.props;

    return (
      <Fragment>
        <TextInput
          value={values[BLOCK_NAME]}
          onChange={handleChange}
          name={BLOCK_NAME}
          label={intl.formatMessage(messages.pageBlockFieldName)}
          placeholder={intl.formatMessage(messages.pageBlockFieldNamePlaceholder)}
          fullWidth
          isEdit
          {...restProps}
        />
        <Select
          label={intl.formatMessage(messages.pageBlockFieldType)}
          name={BLOCK_TYPE}
          value={values[BLOCK_TYPE]}
          options={this.getStatusOptions(intl)}
          onSelect={this.handleSelectStatus}
          placeholder={intl.formatMessage(messages[NONE])}
          id="fieldBlockType"
          {...restProps}
        />
        {this.renderBlockContent(values[BLOCK_TYPE])}
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Change" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.changeTypeModalTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelTypeChange}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton onClick={this.handleConfirmTypeChange}>
              <FormattedMessage {...messages.confirm} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}
