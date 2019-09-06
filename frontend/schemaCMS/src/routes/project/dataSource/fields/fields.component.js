import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { DataGrid } from 'schemaUI';
import { isEmpty } from 'ramda';

import { TopHeader } from '../../../../shared/components/topHeader';
import { Loader } from '../../../../shared/components/loader';
import messages from './fields.messages';
import { Container } from './fields.styles';

const INITIAL_STEP = 0;

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

  state = {
    step: INITIAL_STEP,
  };

  componentDidMount() {
    const { projectId, dataSourceId } = this.props.match.params;

    this.props.fetchFields({ projectId, dataSourceId });
  }

  componentDidUpdate() {
    console.log(this.state.step);
    const isLoading = this.isLoading();

    if (!isLoading && !this.state.maxSteps) {
      this.setState({
        maxSteps: Object.keys(this.props.fields).length,
      });
    }
  }

  componentWillUnmount() {
    this.props.unmountFields();
  }

  getHeaderAndMenuConfig = (title = '') => ({
    headerTitle: title,
    headerSubtitle: this.props.intl.formatMessage(messages.subTitle),
    secondaryMenuItems: [],
  });

  isLoading = () => isEmpty(this.props.fields);

  renderTable() {
    const rows = this.props.previewTable.map((row, rowIndex) => ({ ...row, rowIndex }));
    const columnsIds = ['rowIndex', ...Object.keys(this.props.fields)];
    const columns = columnsIds.map(name => ({ name, displayName: name }));
    const data = { columns, rows };

    return <DataGrid data={data} />;
  }

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig('Knoll Archive');

    console.log(this.props);
    const content = isEmpty(this.props.fields) ? <Loader /> : this.renderTable();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...topHeaderConfig} />
        {content}
      </Container>
    );
  }
}
