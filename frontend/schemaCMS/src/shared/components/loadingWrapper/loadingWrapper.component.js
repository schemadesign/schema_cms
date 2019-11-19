import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, cond, isNil, prop, propEq, T } from 'ramda';

import { ErrorContainer } from '../errorContainer';
import { ERROR_TYPES } from '../errorContainer/errorContainer.constants';
import { Loading } from '../loading';
import { NoData } from '../noData';

export class LoadingWrapper extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    noData: PropTypes.bool,
    noDataContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    error: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  static defaultProps = {
    loading: false,
    noData: false,
    noDataContent: null,
    error: null,
  };

  renderContent = cond([
    [propEq('loading', true), always(<Loading />)],
    [({ error }) => !isNil(error), ({ error }) => <ErrorContainer type={ERROR_TYPES.PAGE}>{error}</ErrorContainer>],
    [propEq('noData', true), ({ noDataContent }) => <NoData>{noDataContent}</NoData>],
    [T, prop('children')],
  ]);

  render() {
    const { loading, noData, noDataContent, error, children } = this.props;

    return this.renderContent({ loading, noData, noDataContent, error, children });
  }
}
