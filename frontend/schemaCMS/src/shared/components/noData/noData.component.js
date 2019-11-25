import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always } from 'ramda';

import { renderWhenTrueOtherwise } from '../../utils/rendering';
import { NoDataContainer } from './noData.styles';
import messages from './noData.messages';

export class NoData extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  renderContent = children =>
    renderWhenTrueOtherwise(always(children), always(<FormattedMessage {...messages.noData} />))(!!children);

  render() {
    const { children } = this.props;

    return <NoDataContainer>{this.renderContent(children)}</NoDataContainer>;
  }
}
