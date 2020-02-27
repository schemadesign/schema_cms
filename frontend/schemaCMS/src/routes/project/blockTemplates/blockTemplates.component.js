import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './blockTemplates.styles';
import messages from './blockTemplates.messages';

export const BlockTemplates = memo(() => {
  return (
    <Container>
      <FormattedMessage {...messages.title} />
    </Container>
  );
});

BlockTemplates.propTypes = {
  match: PropTypes.object.isRequired,
};
