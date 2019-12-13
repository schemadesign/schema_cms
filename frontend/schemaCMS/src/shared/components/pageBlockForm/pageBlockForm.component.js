import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, concat, cond, equals, map, path, pipe, prop } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Form, Icons } from 'schemaUI';

import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';
import { BackButton, NextButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_CONTENT,
  BLOCK_DELETE_IMAGES,
  BLOCK_IMAGE_NAMES,
  BLOCK_IMAGES,
  BLOCK_INPUT_IMAGES,
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
import {
  removeIconStyles,
  UploaderContainer,
  UploaderItem,
  UploaderList,
  UploaderWrapper,
} from './pageBlockForm.styles';
import { renderWhenTrueOtherwise } from '../../utils/rendering';

const { Label } = Form;
const { CloseIcon } = Icons;

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
    const updateNames = pipe(
      map(prop('name')),
      concat(imageNames),
      data => data.map((item, id) => (item.imageName ? { ...item, id } : { imageName: item, id }))
    )([...files]);
    const updatedImages = pipe(
      concat(images),
      data => data.map((item, id) => (item.file ? { ...item, id } : { file: item, id }))
    )([...files]);

    this.props.setFieldValue(BLOCK_INPUT_IMAGES, []);
    this.props.setFieldValue(BLOCK_IMAGES, updatedImages);
    this.props.setFieldValue(BLOCK_IMAGE_NAMES, updateNames);
  };

  handleRemoveImage = ({ id: removeId, image }) => () => {
    const { images, imageNames } = this.props.values;
    const files = images.filter(({ id }) => id !== removeId);
    const names = imageNames.filter(({ id }) => id !== removeId);

    this.props.setFieldValue(BLOCK_IMAGES, files);
    this.props.setFieldValue(BLOCK_IMAGE_NAMES, names);

    if (image) {
      const deleteImages = this.props.values[BLOCK_DELETE_IMAGES].concat(removeId);
      this.props.setFieldValue(BLOCK_DELETE_IMAGES, deleteImages);
    }
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

  renderUploaderItem = ({ imageName, id, image }, index) => (
    <UploaderItem key={index}>
      {imageName}
      <CloseIcon
        id={`removeImage-${index}`}
        onClick={this.handleRemoveImage({ id, image })}
        customStyles={removeIconStyles}
      />
    </UploaderItem>
  );

  renderUploaderList = list =>
    renderWhenTrueOtherwise(
      always(list.map(this.renderUploaderItem)),
      always(<FormattedMessage {...messages.selectImage} />)
    )(!!list.length);

  renderImage = () => (
    <UploaderContainer>
      <Label>
        <FormattedMessage {...messages.pageBlockFieldImage} />
      </Label>
      <UploaderWrapper>
        <Uploader
          name={BLOCK_INPUT_IMAGES}
          value={this.props.values[BLOCK_INPUT_IMAGES]}
          type="file"
          id="fileUpload"
          onChange={({ currentTarget }) => this.handleUploadChange(currentTarget)}
          accept=".png, .jpg, .jpeg, .gif"
          checkOnlyErrors
          multiple
          {...this.props}
        />
      </UploaderWrapper>
      <UploaderList>{this.renderUploaderList(this.props.values.imageNames)}</UploaderList>
    </UploaderContainer>
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
