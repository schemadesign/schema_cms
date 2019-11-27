import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { cond, equals, always } from 'ramda';

import { Container, Form } from './createPageBlock.styles';
import {
  BLOCK_NAME,
  BLOCK_TYPE,
  VALID_TYPE_OPTIONS,
  NONE,
  MARKDOWN_TYPE,
  IMAGE_TYPE,
  EMBED_TYPE,
  CODE_TYPE,
  BLOCK_CONTENT,
  BLOCK_IMAGE,
} from '../../../modules/pageBlock/pageBlock.constants';
import messages from './createPageBlock.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Select } from '../../../shared/components/form/select';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { Uploader } from '../../../shared/components/form/uploader';
import { DATA_SOURCE_FILE } from '../../../modules/dataSource/dataSource.constants';

export class CreatePageBlock extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
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

  handleUploadChange = value => this.props.setFieldValue(DATA_SOURCE_FILE, value);

  renderContent = (messageId, messagePlaceholderId) => (
    <TextInput
      value={this.props.values[BLOCK_CONTENT]}
      name={BLOCK_CONTENT}
      onChange={this.props.handleChange}
      label={this.props.intl.formatMessage(messages[messageId])}
      placeholder={this.props.intl.formatMessage(messages[messagePlaceholderId])}
      fullWidth
      multiline
      {...this.props}
    />
  );

  renderImage = () => (
    <Uploader
      fileName={BLOCK_IMAGE}
      name={DATA_SOURCE_FILE}
      label={this.props.intl.formatMessage(messages.pageBlockFieldImage)}
      type="file"
      id="fileUpload"
      onChange={({ currentTarget }) => this.handleUploadChange(currentTarget)}
      accept="image/gif,image/jpeg"
      checkOnlyErrors
      {...restProps}
    />
  );

  renderBlockContent = cond([
    [equals(MARKDOWN_TYPE), () => this.renderContent('pageBlockFieldMarkdown', 'pageBlockFieldMarkdownPlaceholder')],
    [equals(EMBED_TYPE), () => this.renderContent('pageBlockFieldEmbed', 'pageBlockFieldEmbedPlaceholder')],
    [equals(CODE_TYPE), () => this.renderContent('pageBlockFieldCode', 'pageBlockFieldCodePlaceholder')],
    [equals(IMAGE_TYPE), () => this.renderImage],
    [equals(NONE), always(null)],
  ]);

  render() {
    const { intl, handleSubmit, handleChange, values, ...restProps } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
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
          <NavigationContainer>
            <BackButton id="backBtn" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton id="createPageBlockBtn" type="submit" disabled={!restProps.isValid}>
              <FormattedMessage {...messages.createPageBlock} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Container>
    );
  }
}
