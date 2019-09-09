import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, Icons } from 'schemaUI';
import { TopHeader } from '../../../../shared/components/topHeader';
import { addDataSourceStyles, Container } from './list.styles';
import messages from './list.messages';

export class List extends PureComponent {
  static propTypes = {
    createDataSource: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.intl.formatMessage(messages.title),
    headerSubtitle: this.props.intl.formatMessage(messages.subTitle),
    secondaryMenuItems: [
      {
        label: this.props.intl.formatMessage(messages.projectDetails),
        to: `/project/view/${this.props.match.params.projectId}`,
      },
    ],
  });

  handleCreateDataSource = () => {
    const projectId = this.props.match.params.projectId;

    this.props.createDataSource({ projectId });
  };

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <Button customStyles={addDataSourceStyles} onClick={this.handleCreateDataSource}>
          <Icons.PlusIcon />
        </Button>
      </Container>
    );
  }
}
