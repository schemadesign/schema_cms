import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Container } from './dataSourceTags.styles';
import messages from './dataSourceTags.messages';

export const DataSourceTags = () => {
  return (
    <Container>
      <FormattedMessage {...messages.title} />
    </Container>
  );
};

DataSourceTags.propTypes = {};
