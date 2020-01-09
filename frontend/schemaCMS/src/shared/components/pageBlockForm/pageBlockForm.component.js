import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { addIndex, always, concat, cond, equals, findLast, has, ifElse, map, path, pipe, propEq } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Icons } from 'schemaUI';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

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
import { removeIconStyles, UploaderContainer, UploaderItem, UploaderList, ImageName } from './pageBlockForm.styles';
import { getEventFiles } from '../../utils/helpers';
import { Draggable } from '../draggable';
import { IconWrapper } from '../../../routes/dataSource/dataWranglingScripts/dataWranglingScripts.styles';

const { CloseIcon, MenuIcon } = Icons;

export class PageBlockForm extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    block: PropTypes.object,
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
  handleUploadChange = data => {
    const files = getEventFiles(data);
    const { values, block = { images: [] } } = this.props;
    const { images } = values;
    const mapIndexed = addIndex(map);
    const imagesNames = block.images.filter(({ id }) => !this.props.values[BLOCK_DELETE_IMAGES].includes(id));
    const updatedImages = pipe(
      concat(images),
      mapIndexed((item, id) =>
        ifElse(has('file'), always({ file: item.file, id: `image-${id}` }), always({ file: item, id: `image-${id}` }))(
          item
        )
      )
    )([...files]);
    const updatedNames = pipe(
      map(({ file, id }) => ({ imageName: file.name, id })),
      concat(imagesNames)
    )(updatedImages);

    this.props.setFieldValue(BLOCK_INPUT_IMAGES, []);
    this.props.setFieldValue(BLOCK_IMAGES, updatedImages);
    this.props.setFieldValue(BLOCK_IMAGE_NAMES, updatedNames);
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

  handleMove = (dragIndex, hoverIndex) => {
    let { imageNames, images } = this.props.values;
    const dragCard = imageNames[dragIndex];

    imageNames.splice(dragIndex, 1);
    imageNames.splice(hoverIndex, 0, dragCard);

    const files = imageNames.map(({ id }) => findLast(propEq('id', id), images));

    this.props.setFieldValue(BLOCK_IMAGES, files);
    this.props.setFieldValue(`${this.props.values[BLOCK_TYPE]}-${BLOCK_CONTENT}`, imageNames);
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
    <Draggable key={index} accept="IMAGE" onMove={this.handleMove} id={id} index={index}>
      {makeDraggable => {
        const draggableIcon = makeDraggable(
          <IconWrapper>
            <MenuIcon />
          </IconWrapper>
        );

        return (
          <UploaderItem>
            {draggableIcon}
            <ImageName>{imageName}</ImageName>
            <CloseIcon
              id={`removeImage-${index}`}
              onClick={this.handleRemoveImage({ id, image })}
              customStyles={removeIconStyles}
            />
          </UploaderItem>
        );
      }}
    </Draggable>
  );

  renderImage = () => (
    <UploaderContainer>
      <Uploader
        name={BLOCK_INPUT_IMAGES}
        value={this.props.values[BLOCK_INPUT_IMAGES]}
        type="file"
        id="fileUpload"
        label={this.props.intl.formatMessage(messages.pageBlockFieldImage)}
        placeholder={this.props.intl.formatMessage(messages.selectImage)}
        onChange={this.handleUploadChange}
        accept=".png, .jpg, .jpeg, .gif"
        checkOnlyErrors
        multiple
        {...this.props}
      />
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <UploaderList>{this.props.values.imageNames.map(this.renderUploaderItem)}</UploaderList>
      </DndProvider>
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
