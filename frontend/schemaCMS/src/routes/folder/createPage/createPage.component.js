import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { path } from 'ramda';
import PropTypes from 'prop-types';

import { Form } from './createPage.styles';
import messages from './createPage.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { PageForm } from '../../../shared/components/pageForm';

export class CreatePage extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  getFolderId = () => path(['match', 'params', 'folderId'], this.props);

  handleCancelClick = () => this.props.history.push(`/folder/${this.getFolderId()}`);

  render() {
    const { handleSubmit, isValid, isSubmitting } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <PageForm {...this.props} />
          <NavigationContainer>
            <BackButton id="cancelBtn" type="button" onClick={this.handleCancelClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton id="createPageBtn" type="submit" loading={isSubmitting} disabled={!isValid || isSubmitting}>
              <FormattedMessage {...messages.createPage} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
