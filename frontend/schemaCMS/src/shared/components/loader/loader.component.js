import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './loader.messages';

import { LoaderContainer } from './loader.styles';

export class Loader extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <LoaderContainer>
        <FormattedMessage {...messages.loading} />
      </LoaderContainer>
    );
  }
}
