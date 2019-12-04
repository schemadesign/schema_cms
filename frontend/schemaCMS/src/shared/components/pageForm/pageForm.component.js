import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { TextInput } from '../form/inputs/textInput';
import { PAGE_DESCRIPTION, PAGE_KEYWORDS, PAGE_TITLE } from '../../../modules/page/page.constants';
import messages from './pageForm.messages';

export class PageForm extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  };

  render() {
    const { values, handleChange, intl, ...restProps } = this.props;
    return (
      <Fragment>
        <TextInput
          value={values[PAGE_TITLE]}
          onChange={handleChange}
          name={PAGE_TITLE}
          label={intl.formatMessage(messages.pageFieldTitle)}
          placeholder={intl.formatMessage(messages.pageFieldTitlePlaceholder)}
          fullWidth
          isEdit
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
          isEdit
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
          isEdit
          {...restProps}
        />
      </Fragment>
    );
  }
}
