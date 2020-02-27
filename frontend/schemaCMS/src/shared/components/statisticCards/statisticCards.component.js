import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { CardValue, CardWrapper, Statistics, statisticsCardStyles, CardHeader } from './statisticCards.styles';

export class StatisticCards extends PureComponent {
  static propTypes = {
    statistics: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  };

  handleGoTo = to => () => (to ? this.props.history.push(to) : null);

  renderStatisticHeader = text => (
    <CardHeader>
      <FormattedMessage {...text} />
    </CardHeader>
  );

  renderStatistic = ({ header, value, to, id }, index) => (
    <CardWrapper key={index}>
      <Card
        id={id}
        headerComponent={this.renderStatisticHeader(header)}
        onClick={this.handleGoTo(to)}
        customStyles={statisticsCardStyles}
      >
        <CardValue id={`${id}Value`}>{value}</CardValue>
      </Card>
    </CardWrapper>
  );

  render() {
    return <Statistics>{this.props.statistics.map(this.renderStatistic)}</Statistics>;
  }
}
