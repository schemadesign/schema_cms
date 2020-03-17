import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './page.styles';
import messages from './page.messages';

export const Page = () => {
  return (
    <Container>
      <FormattedMessage {...messages.title} />
    </Container>
  );
};

Page.propTypes = {};
