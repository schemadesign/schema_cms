import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, either, cond, findLast, path, pipe, propEq, T } from 'ramda';

import { Loader } from '../loader';
import { NoData } from '..//noData';
import { Container } from './loaderWrapper.styles';

export class LoaderWrapper extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    noData: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  renderContent = cond([
    [propEq('loading', true), always(<Loader />)],
    [propEq('noData', true), always(<NoData />)],
    [T, () => this.props.children],
  ]);

  render() {
    return <Container>{this.renderContent(this.props)}</Container>;
  }
}
