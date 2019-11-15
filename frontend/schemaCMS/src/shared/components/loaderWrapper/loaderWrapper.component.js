import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, either, cond, findLast, isNil, path, pipe, prop, propEq, T } from 'ramda';

import { Loader } from '../loader';
import { NoData } from '../noData';
import { Container, ErrorContainer } from './loaderWrapper.styles';

export class LoaderWrapper extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    noData: PropTypes.bool,
    noDataContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    error: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  renderContent = cond([
    [propEq('loading', true), always(<Loader />)],
    [({ error }) => !isNil(error), () => <ErrorContainer>{this.props.error}</ErrorContainer>],
    [propEq('noData', true), ({ noDataContent }) => <NoData>{noDataContent}</NoData>],
    [T, prop('children')],
  ]);

  render() {
    const { loading, noData, noDataContent, error, children } = this.props;

    return <Container>{this.renderContent({ loading, noData, error, children })}</Container>;
  }
}
