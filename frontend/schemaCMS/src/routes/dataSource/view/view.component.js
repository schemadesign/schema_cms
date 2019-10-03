import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, cond, equals, T } from 'ramda';

import { Container } from './view.styles';
import messages from './view.messages';
import { Source } from './source';
import { DataPreview } from '../../../shared/components/dataPreview';
import { DataWranglingScripts } from './dataWranglingScripts';
import { DataWranglingResult } from '../../dataWranglingResult';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { TopHeader } from '../../../shared/components/topHeader';
import {
  DATA_WRANGLING_STEP,
  DATA_WRANGLING_RESULT_STEP,
  FIELDS_STEP,
  INITIAL_STEP,
  STATUS_DRAFT,
} from '../../../modules/dataSource/dataSource.constants';

export class View extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    dataWranglingScripts: PropTypes.array.isRequired,
    fetchDataSource: PropTypes.func.isRequired,
    unmountDataSource: PropTypes.func.isRequired,
    removeDataSource: PropTypes.func.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWranglingScript: PropTypes.func.isRequired,
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
  };

  componentDidMount() {
    if (!this.props.dataSource.id) {
      const { dataSourceId } = this.props.match.params;

      this.props.fetchDataSource({ dataSourceId });
    }
  }

  componentWillUnmount() {
    this.props.unmountDataSource();
  }

  getHeaderSubtitle = cond([
    [equals(INITIAL_STEP), always(this.props.intl.formatMessage(messages.source))],
    [equals(FIELDS_STEP), always(this.props.intl.formatMessage(messages.fields))],
    [equals(DATA_WRANGLING_STEP), always(this.props.intl.formatMessage(messages.dataWrangling))],
    [equals(DATA_WRANGLING_RESULT_STEP), always(this.props.intl.formatMessage(messages.dataWranglingResult))],
    [T, always(null)],
  ]);

  getTitle = intl =>
    this.props.dataSource.status === STATUS_DRAFT ? intl.formatMessage(messages.title) : this.props.dataSource.name;

  getHeaderAndMenuConfig = activeStep => {
    const { dataSource, removeDataSource, intl } = this.props;
    const headerTitle = this.getTitle(intl);
    const { project: projectId, id: dataSourceId } = dataSource;

    const secondaryMenuItems = [
      {
        label: intl.formatMessage(messages.dataSourceList),
        to: `/project/${projectId}/datasource/`,
      },
      {
        label: intl.formatMessage(messages.removeDataSource),
        onClick: () => removeDataSource({ projectId, dataSourceId }),
      },
    ];

    return {
      headerTitle,
      headerSubtitle: this.getHeaderSubtitle(activeStep),
      secondaryMenuItems,
    };
  };

  renderContentForm = ({ activeStep, ...props }) =>
    cond([
      [equals(INITIAL_STEP), always(<Source {...props} />)],
      [equals(FIELDS_STEP), always(<DataPreview {...props} />)],
      [equals(DATA_WRANGLING_STEP), always(<DataWranglingScripts {...props} />)],
      [equals(DATA_WRANGLING_RESULT_STEP), always(<DataWranglingResult {...props} />)],
      [equals(5), always(null)],
      [equals(6), always(null)],
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
    const topHeaderConfig = this.getHeaderAndMenuConfig(activeStep);

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
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
