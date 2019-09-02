import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, Header, Icons, Typography } from 'schemaUI';
import { addDataSourceStyles, Container } from './list.styles';

const { H1, H2 } = Typography;

export class List extends PureComponent {
  static propTypes = {
    createDataSource: PropTypes.func.isRequired,
  };

  handleCreateDataSource = () => this.props.createDataSource({ projectId: 1 });

  render() {
    return (
      <Container>
        <Header onButtonClick={this.handleToggleMenu}>
          <H2>Data Sources</H2>
          <H1>Overview</H1>
        </Header>
        <Button customStyles={addDataSourceStyles} onClick={this.handleCreateDataSource}>
          <Icons.PlusIcon />
        </Button>
      </Container>
    );
  }
}
