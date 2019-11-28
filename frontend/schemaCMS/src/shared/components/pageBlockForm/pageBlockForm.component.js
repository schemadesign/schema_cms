import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, cond, equals, pathOr } from 'ramda';

import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_CONTENT,
  BLOCK_IMAGE,
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
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  };

  getStatusOptions = intl =>
    [...VALID_TYPE_OPTIONS, NONE].map(status => ({
      value: status,
      label: intl.formatMessage(messages[status]),
    }));

  handleSelectStatus = ({ value: selectedStatus }) => {
    this.props.setFieldValue(BLOCK_TYPE, selectedStatus);
  };

  handleUploadChange = ({ files: [uploadFile] }) => {
    this.props.setFieldValue(BLOCK_IMAGE, uploadFile);
    this.props.setFieldValue('imageName', pathOr('', ['name'], uploadFile));
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
      fileName={this.props.values.imageName}
      name={BLOCK_IMAGE}
      label={this.props.intl.formatMessage(messages.pageBlockFieldImage)}
      type="file"
      id="fileUpload"
      onChange={({ currentTarget }) => this.handleUploadChange(currentTarget)}
      accept="image/gif,image/jpeg"
      checkOnlyErrors
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
          {...restProps}
        />
        <Select
          label={intl.formatMessage(messages.pageBlockFieldType)}
          name={BLOCK_TYPE}
          value={values[BLOCK_TYPE]}
          options={this.getStatusOptions(intl)}
          onSelect={this.handleSelectStatus}
          id="fieldBlockType"
          {...restProps}
        />
        {this.renderBlockContent(values[BLOCK_TYPE])}
      </Fragment>
    );
  }
}
