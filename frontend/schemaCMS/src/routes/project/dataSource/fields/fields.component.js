import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { TopHeader } from '../../../../shared/components/topHeader';
import messages from './fields.messages';
import { Container } from './fields.styles';

export class Fields extends PureComponent {
  static propTypes = {
    fields: PropTypes.object,
    previewTable: PropTypes.array,
    fetchFields: PropTypes.func.isRequired,
    unmountFields: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { projectId, dataSourceId } = this.props.match.params;

    this.props.fetchFields({ projectId, dataSourceId });
  }

  componentWillUnmount() {
    this.props.unmountFields();
  }

  getHeaderAndMenuConfig = (title = '') => ({
    headerTitle: title,
    headerSubtitle: this.props.intl.formatMessage(messages.subTitle),
    secondaryMenuItems: [],
  });

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig('Knoll Archive');

    console.log(this.props);
    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...topHeaderConfig} />
      </Container>
    );
  }
}
