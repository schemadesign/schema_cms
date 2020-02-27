import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { identity, ifElse, is } from 'ramda';

import { CardValue, CardWrapper, Statistics, statisticsCardStyles, CardHeader } from './statisticCards.styles';

export class StatisticCards extends PureComponent {
  static propTypes = {
    statistics: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  };

  handleGoTo = to => () => (to ? this.props.history.push(to) : null);

  renderText = ifElse(is(String), identity, text => <FormattedMessage {...text} />);

  renderStatisticHeader = text => <CardHeader>{this.renderText(text)}</CardHeader>;

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
