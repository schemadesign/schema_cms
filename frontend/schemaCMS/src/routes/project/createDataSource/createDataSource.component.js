import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Source } from '../../dataSource/view/source';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './createDataSource.messages';

export class CreateDataSource extends PureComponent {
  static propTypes = {
    createDataSource: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  render() {
    return (
      <Fragment>
        <TopHeader {...this.getHeaderAndMenuConfig()} />
        <Source {...this.props} />
      </Fragment>
    );
  }
}
