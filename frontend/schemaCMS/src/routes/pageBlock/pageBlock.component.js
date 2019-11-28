import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { Container, Form } from './pageBlock.styles';
import messages from './pageBlock.messages';
import { TopHeader } from '../../shared/components/topHeader';
import { ContextHeader } from '../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { PageBlockForm } from '../../shared/components/pageBlockForm';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';

export class PageBlock extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    block: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fetchPageBlock: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        blockId: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const blockId = path(['match', 'params', 'blockId'], this.props);
      await this.props.fetchPageBlock({ blockId });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleBackClick = () => this.props.history.push(`/page/${path(['block', 'page', 'id'], this.props)}`);

  render() {
    const { handleSubmit, isSubmitting, ...restProps } = this.props;
    const { loading, error } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <LoadingWrapper loading={loading} error={error}>
            <PageBlockForm {...this.props} />
          </LoadingWrapper>
          <NavigationContainer>
            <BackButton id="backBtn" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.back} />
            </BackButton>
            <NextButton
              id="editPageBlockBtn"
              loading={isSubmitting}
              type="submit"
              disabled={!restProps.isValid || isSubmitting}
            >
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Container>
    );
  }
}
