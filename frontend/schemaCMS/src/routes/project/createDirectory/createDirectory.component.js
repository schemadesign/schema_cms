import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Form } from './createDirectory.styles';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './createDirectory.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { DIRECTORY_NAME } from '../../../modules/directory/directory.constants';

export class CreateDirectory extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  render() {
    const { intl, values, handleSubmit, handleChange, handleBlur } = this.props;
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Fragment>
        <ContextHeader title={topHeaderConfig.headerTitle} subtitle={topHeaderConfig.headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={values[DIRECTORY_NAME]}
            onChange={handleChange}
            onBlur={handleBlur}
            name={DIRECTORY_NAME}
            label={intl.formatMessage(messages.directoryFieldName)}
            placeholder={intl.formatMessage(messages.directoryFieldPlaceholder)}
            fullWidth
            isEdit
          />
        </Form>
      </Fragment>
    );
  }
}
