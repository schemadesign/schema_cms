import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { path } from 'ramda';

import { Container } from './edit.styles';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { Form } from '../../directory/createPage/createPage.styles';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { PAGE_DESCRIPTION, PAGE_KEYWORDS, PAGE_TITLE } from '../../../modules/page/page.constants';
import messages from './edit.messages';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

export class Edit extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    fetchPage: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        pageId: PropTypes.string.isRequired,
      }),
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const { pageId } = this.props.match.params;

      await this.props.fetchPage({ pageId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getDirectoryId = () => path(['page', 'directory', 'id'], this.props);

  handleBackClick = () => this.props.history.push(`/directory/${this.getDirectoryId()}`);

  render() {
    const { loading } = this.state;
    const { intl, values, handleSubmit, handleChange, ...restProps } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <LoadingWrapper loading={loading}>
          <Form onSubmit={handleSubmit}>
            <TextInput
              value={values[PAGE_TITLE]}
              onChange={handleChange}
              name={PAGE_TITLE}
              label={intl.formatMessage(messages.pageFieldTitle)}
              placeholder={intl.formatMessage(messages.pageFieldTitlePlaceholder)}
              fullWidth
              {...restProps}
            />
            <TextInput
              value={values[PAGE_DESCRIPTION]}
              onChange={handleChange}
              name={PAGE_DESCRIPTION}
              label={intl.formatMessage(messages.pageFieldDescription)}
              placeholder={intl.formatMessage(messages.pageFieldDescriptionPlaceholder)}
              fullWidth
              multiline
              {...restProps}
            />
            <TextInput
              value={values[PAGE_KEYWORDS]}
              onChange={handleChange}
              name={PAGE_KEYWORDS}
              label={intl.formatMessage(messages.pageFieldKeywords)}
              placeholder={intl.formatMessage(messages.pageFieldKeywordsPlaceholder)}
              fullWidth
              multiline
              {...restProps}
            />
            <NavigationContainer>
              <BackButton id="backBtn" onClick={this.handleBackClick}>
                <FormattedMessage {...messages.back} />
              </BackButton>
              <NextButton id="savePageBtn" type="submit" disabled={!restProps.isValid}>
                <FormattedMessage {...messages.save} />
              </NextButton>
            </NavigationContainer>
          </Form>
        </LoadingWrapper>
      </Container>
    );
  }
}
