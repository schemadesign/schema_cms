import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './noData.messages';

import { NoDataContainer } from './noData.styles';

export class NoData extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <NoDataContainer>
        <FormattedMessage {...messages.noData} />
      </NoDataContainer>
    );
  }
}
