import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { Container, Button, ButtonContainer, PageTitle } from './dataSourceNavigation.styles';
import messages from './dataSourceNavigation.messages';
import {
  FILTERS_PAGE,
  PREVIEW_PAGE,
  RESULT_PAGE,
  SOURCE_PAGE,
  STEPS_PAGE,
  VIEWS_PAGE,
} from '../../../modules/dataSource/dataSource.constants';

const { FieldIcon, FilterIcon, ViewIcon, UploadIcon, ResultIcon } = Icons;
const listIcons = [
  { Icon: UploadIcon, page: SOURCE_PAGE },
  { Icon: FieldIcon, page: PREVIEW_PAGE },
  { Icon: ResultIcon, page: STEPS_PAGE },
  { Icon: ResultIcon, page: RESULT_PAGE },
  { Icon: FilterIcon, page: FILTERS_PAGE },
  { Icon: ViewIcon, page: VIEWS_PAGE },
];
const iconSize = { width: 54, height: 54 };

export class DataSourceNavigation extends PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    dataSource: PropTypes.object.isRequired,
    hideOnDesktop: PropTypes.bool,
  };

  static defaultProps = {
    hideOnDesktop: false,
  };

  goToPage = page => () => this.props.history.push(`/datasource/${this.props.dataSource.id}/${page}`);

  renderButtons = () =>
    listIcons.map(({ Icon, page }, index) => (
      <ButtonContainer key={index}>
        <Button onClick={this.goToPage(page)}>
          <Icon customStyles={iconSize} />
        </Button>
        <PageTitle>
          <FormattedMessage {...messages[page]} />
        </PageTitle>
      </ButtonContainer>
    ));

  render() {
    return <Container hideOnDesktop={this.props.hideOnDesktop}>{this.renderButtons()}</Container>;
  }
}
