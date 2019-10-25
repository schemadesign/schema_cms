import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path, always } from 'ramda';

import { Container } from './jobDetail.styles';
import browserHistory from '../../shared/utils/history';
import { renderWhenTrue } from '../../shared/utils/rendering';

export class JobDetail extends PureComponent {
  static propTypes = {
    job: PropTypes.object.isRequired,
    fetchOne: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  async componentDidMount() {
    try {
      const payload = path(['match', 'params'], this.props);
      await this.props.fetchOne(payload);
    } catch (e) {
      browserHistory.push('/');
    }
  }

  renderContent = job => renderWhenTrue(always(<Container>{job.pk}</Container>))(!!job.pk);

  render() {
    return this.renderContent(this.props.job);
  }
}
