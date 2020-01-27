import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './dataSourceTag.styles';
import messages from './dataSoureceTag.messages';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { ContextHeader } from '../../shared/components/contextHeader';
import { getMatchParam } from '../../shared/utils/helpers';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import reportError from '../../shared/utils/reportError';
import { DataSourceTagForm } from '../../shared/components/dataSourceTagForm';

export class DataSourceTag extends PureComponent {
  static propTypes = {
    updateTag: PropTypes.func.isRequired,
    fetchTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    tag: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tagId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const tagId = getMatchParam(this.props, 'tagId');
      await this.props.fetchTag({ tagId });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: pathOr('', ['tag', 'datasource', 'name'], this.props),
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  render() {
    const { error, loading } = this.state;
    const { tag, removeTag, updateTag, history, intl } = this.props;
    const dataSourceId = pathOr('', ['tag', 'datasource', 'id'], this.props);
    const headerConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <MobileMenu {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <LoadingWrapper loading={loading} error={error}>
          <DataSourceTagForm
            updateTag={updateTag}
            tag={tag}
            removeTag={removeTag}
            history={history}
            dataSourceId={dataSourceId}
            intl={intl}
          />
        </LoadingWrapper>
      </Container>
    );
  }
}
