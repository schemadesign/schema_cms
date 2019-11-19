import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, cond, equals, T } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container, ComingSoon } from './view.styles';
import messages from './view.messages';
import { Source } from '../../../shared/components/source';
import { DataWranglingScripts } from './dataWranglingScripts';
import { Filters } from './filters';
import { DataWranglingResult } from '../../dataWranglingResult';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import {
  DATA_WRANGLING_STEP,
  DATA_WRANGLING_RESULT_STEP,
  FIELDS_STEP,
  INITIAL_STEP,
  FILTERS_STEP,
  VIEWS_STEP,
  META_DATA_STEP,
} from '../../../modules/dataSource/dataSource.constants';
import { StepNavigation } from '../../../shared/components/stepNavigation';
import { Fields } from './fields';

export class View extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    previewData: PropTypes.object.isRequired,
    dataWranglingScripts: PropTypes.array.isRequired,
    removeDataSource: PropTypes.func.isRequired,
    fetchPreview: PropTypes.func.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    isAnyJobProcessing: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWranglingScript: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
        step: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    onDataSourceChange: PropTypes.func.isRequired,
  };

  getHeaderSubtitle = cond([
    [equals(INITIAL_STEP), always(this.props.intl.formatMessage(messages.source))],
    [equals(FIELDS_STEP), always(this.props.intl.formatMessage(messages.fields))],
    [equals(DATA_WRANGLING_STEP), always(this.props.intl.formatMessage(messages.dataWrangling))],
    [equals(DATA_WRANGLING_RESULT_STEP), always(this.props.intl.formatMessage(messages.dataWranglingResult))],
    [equals(FILTERS_STEP), always(this.props.intl.formatMessage(messages.filters))],
    [equals(VIEWS_STEP), always(this.props.intl.formatMessage(messages.views))],
    [equals(META_DATA_STEP), always(this.props.intl.formatMessage(messages.metaData))],
    [T, always(null)],
  ]);

  getTitle = intl => (this.props.dataSource.metaData ? this.props.dataSource.name : intl.formatMessage(messages.title));

  getHeaderAndMenuConfig = activeStep => {
    const { dataSource, intl } = this.props;
    const headerTitle = this.getTitle(intl);
    const { project: projectId } = dataSource;

    const secondaryMenuItems = [
      {
        label: intl.formatMessage(messages.dataSourceList),
        to: `/project/${projectId}/datasource/`,
      },
    ];

    return {
      headerTitle,
      headerSubtitle: this.getHeaderSubtitle(activeStep),
      secondaryMenuItems,
    };
  };

  renderComingSoon = () => (
    <ComingSoon>
      <FormattedMessage {...messages.coming} />
      <StepNavigation {...this.props} />
    </ComingSoon>
  );

  renderContentForm = ({ activeStep, ...props }) =>
    cond([
      [equals(INITIAL_STEP), always(<Source {...props} />)],
      [equals(FIELDS_STEP), always(<Fields {...props} />)],
      [equals(DATA_WRANGLING_STEP), always(<DataWranglingScripts {...props} />)],
      [equals(DATA_WRANGLING_RESULT_STEP), always(<DataWranglingResult {...props} />)],
      [equals(FILTERS_STEP), always(<Filters {...props} />)],
      [equals(VIEWS_STEP), this.renderComingSoon],
      [equals(META_DATA_STEP), this.renderComingSoon],
      [T, always(null)],
    ])(activeStep);

  renderContent = renderWhenTrue(() => {
    const {
      dataSource,
      intl,
      match: {
        params: { step },
      },
    } = this.props;
    const activeStep = parseInt(step, 10);
    const headerConfig = this.getHeaderAndMenuConfig(activeStep);

    return (
      <Fragment>
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        {this.renderContentForm({
          activeStep,
          intl,
          dataSource,
          ...this.props,
        })}
      </Fragment>
    );
  });

  render() {
    return <Container>{this.renderContent(!!this.props.dataSource.id)}</Container>;
  }
}
