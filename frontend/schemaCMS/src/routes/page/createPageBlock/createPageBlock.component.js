import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Container, Form } from './createPageBlock.styles';
import messages from './createPageBlock.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { PageBlockForm } from '../../../shared/components/pageBlockForm';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { PAGE_MENU_OPTIONS } from '../../pageBlock/pageBlock.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';

export class CreatePageBlock extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        pageId: PropTypes.string.isRequired,
      }),
    }),
  };

  handleBackClick = () => this.props.history.push(`/page/${getMatchParam(this.props, 'pageId')}`);

  render() {
    const { handleSubmit, isSubmitting, userRole, ...restProps } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(PAGE_MENU_OPTIONS, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <PageBlockForm {...this.props} />
          <NavigationContainer fixed>
            <BackButton id="cancelBtn" type="button" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton
              id="createPageBlockBtn"
              loading={isSubmitting}
              type="submit"
              disabled={!restProps.isValid || isSubmitting}
            >
              <FormattedMessage {...messages.create} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Container>
    );
  }
}
