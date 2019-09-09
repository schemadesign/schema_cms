import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty } from 'ramda';

import { Loader } from '../../../../../shared/components/loader';
import { PreviewTable } from './previewTable';
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

  isLoading = () => isEmpty(this.props.fields);

  renderTable() {
    const { fields, previewTable } = this.props;

    return <PreviewTable fields={fields} data={previewTable} />;
  }

  render() {
    const content = this.isLoading() ? <Loader /> : this.renderTable();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        {content}
      </Container>
    );
  }
}
