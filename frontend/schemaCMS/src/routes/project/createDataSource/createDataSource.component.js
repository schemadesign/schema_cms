import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Source } from '../../../shared/components/source';
import { Container } from './createDataSource.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './createDataSource.messages';

export class CreateDataSource extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    onDataSourceChange: PropTypes.func.isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  render() {
    return (
      <Container>
        <TopHeader {...this.getHeaderAndMenuConfig()} />
        <Source {...this.props} />
      </Container>
    );
  }
}
