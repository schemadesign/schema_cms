import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Form } from './createPage.styles';
import messages from './createPage.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { PAGE_DESCRIPTION, PAGE_KEYWORDS, PAGE_TITLE } from '../../../modules/page/page.constants';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { getProjectId } from '../../../shared/utils/helpers';

export class CreatePage extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
  };

  getDirectoryId = () => path(['match', 'params', 'directoryId'], this.props);

  handleCancelClick = () => this.props.history.push(`/directory/${this.getDirectoryId()}`);

  render() {
    const { intl, values, handleSubmit, handleChange, ...restProps } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
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
            <BackButton id="cancelBtn" onClick={this.handleCancelClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton id="createPageBtn" type="submit" disabled={!restProps.isValid}>
              <FormattedMessage {...messages.createPage} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
