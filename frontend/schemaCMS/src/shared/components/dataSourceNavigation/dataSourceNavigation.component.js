import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { split, last, pipe, equals, path, propEq, pathEq, complement, both, either } from 'ramda';

import { Container, Button, ButtonContainer, PageTitle } from './dataSourceNavigation.styles';
import messages from './dataSourceNavigation.messages';
import {
  FILTERS_PAGE,
  METADATA_PAGE,
  PREVIEW_PAGE,
  RESULT_PAGE,
  SOURCE_PAGE,
  STATES_PAGE,
  STEPS_PAGE,
  TAGS_PAGE,
} from '../../../modules/dataSource/dataSource.constants';

const { FieldIcon, FilterIcon, TagIcon, UploadIcon, ResultIcon } = Icons;
export const listIcons = [
  { Icon: UploadIcon, page: SOURCE_PAGE, id: 'sourceBtn' },
  { Icon: FieldIcon, page: PREVIEW_PAGE, id: 'fieldsBtn' },
  { Icon: ResultIcon, page: STEPS_PAGE, id: 'stepsBtn' },
  { Icon: ResultIcon, page: RESULT_PAGE, id: 'resultsBtn' },
  { Icon: FilterIcon, page: FILTERS_PAGE, id: 'filtersBtn' },
  { Icon: TagIcon, page: TAGS_PAGE, id: 'tagsBtn' },
  { Icon: TagIcon, page: STATES_PAGE, id: 'statesBtn' },
  { Icon: TagIcon, page: METADATA_PAGE, id: 'metaDataBtn' },
];
const iconSize = { width: 54, height: 54 };

export class DataSourceNavigation extends PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    dataSource: PropTypes.object.isRequired,
    hideOnDesktop: PropTypes.bool,
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    hideOnDesktop: false,
  };

  getIsActive = page =>
    pipe(
      path(['match', 'url']),
      split('/'),
      last,
      equals(page)
    )(this.props);

  getIsDisabled = either(
    both(pathEq(['dataSource', 'activeJob'], null), complement(propEq('page', SOURCE_PAGE))),
    both(pathEq(['dataSource', 'activeJob', 'scripts'], []), propEq('page', RESULT_PAGE))
  );

  goToPage = page => () => this.props.history.push(`/datasource/${this.props.dataSource.id}/${page}`);

  renderButtons = ({ dataSource }) =>
    listIcons.map(({ Icon, page, id }, index) => (
      <ButtonContainer key={index}>
        <Button
          onClick={this.goToPage(page)}
          active={this.getIsActive(page)}
          disabled={this.getIsDisabled({ dataSource, page })}
        >
          <Icon id={id} customStyles={iconSize} />
        </Button>
        <PageTitle>
          <FormattedMessage {...messages[page]} />
        </PageTitle>
      </ButtonContainer>
    ));

  render() {
    return <Container hideOnDesktop={this.props.hideOnDesktop}>{this.renderButtons(this.props)}</Container>;
  }
}
