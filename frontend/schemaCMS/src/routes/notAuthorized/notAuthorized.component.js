import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'schemaUI';

import messages from './notAuthorized.messages';
import { Container } from './notAuthorized.styles';

const { H1 } = Typography;

export class NotAuthorized extends PureComponent {
  render() {
    return (
      <Container>
        <H1>
          <FormattedMessage {...messages.notAuthorized} />
        </H1>
      </Container>
    );
  }
}
