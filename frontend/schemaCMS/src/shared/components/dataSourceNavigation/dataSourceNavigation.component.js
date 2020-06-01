import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { split, last, pipe, equals, path, propEq, pathEq, complement, both, either } from 'ramda';

import { Container, InnerContainer, Button, ButtonContainer, PageTitle } from './dataSourceNavigation.styles';
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

const { FieldIcon, FilterIcon, TagIcon, UploadIcon, ResultIcon, MetadataIcon, StateIcon } = Icons;

const defaultIconStyles = { width: 30, height: 30 };

const listIcons = [
  { Icon: UploadIcon, page: SOURCE_PAGE, id: 'sourceBtn', iconStyles: defaultIconStyles },
  { Icon: FieldIcon, page: PREVIEW_PAGE, id: 'fieldsBtn', iconStyles: defaultIconStyles },
  { Icon: ResultIcon, page: STEPS_PAGE, id: 'stepsBtn', iconStyles: { width: 35, height: 35, marginTop: 1 } },
  { Icon: ResultIcon, page: RESULT_PAGE, id: 'resultsBtn', iconStyles: { width: 35, height: 35, marginTop: 1 } },
  { Icon: FilterIcon, page: FILTERS_PAGE, id: 'filtersBtn', iconStyles: { width: 28, height: 28 } },
  { Icon: TagIcon, page: TAGS_PAGE, id: 'tagsBtn', iconStyles: defaultIconStyles },
  { Icon: StateIcon, page: STATES_PAGE, id: 'statesBtn', iconStyles: defaultIconStyles },
  { Icon: MetadataIcon, page: METADATA_PAGE, id: 'metaDataBtn', iconStyles: defaultIconStyles },
];

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
    listIcons.map(({ Icon, page, id, iconStyles }, index) => (
      <ButtonContainer key={index}>
        <Button
          onClick={this.goToPage(page)}
          active={this.getIsActive(page)}
          disabled={this.getIsDisabled({ dataSource, page })}
        >
          <Icon id={id} customStyles={iconStyles} />
        </Button>
        <PageTitle>
          <FormattedMessage {...messages[page]} />
        </PageTitle>
      </ButtonContainer>
    ));

  render() {
    return (
      <Container hideOnDesktop={this.props.hideOnDesktop}>
        <InnerContainer>{this.renderButtons(this.props)}</InnerContainer>
      </Container>
    );
  }
}
