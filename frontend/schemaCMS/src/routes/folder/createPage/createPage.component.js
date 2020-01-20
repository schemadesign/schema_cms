import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Form } from './createPage.styles';
import messages from './createPage.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { PageForm } from '../../../shared/components/pageForm';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { PAGE_MENU_OPTIONS } from '../../pageBlock/pageBlock.constants';

export class CreatePage extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  handleCancelClick = () => this.props.history.push(`/folder/${getMatchParam(this.props, 'folderId')}`);

  render() {
    const { handleSubmit, isValid, isSubmitting, userRole } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(PAGE_MENU_OPTIONS, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <PageForm {...this.props} />
          <NavigationContainer fixed>
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
