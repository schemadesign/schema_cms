import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, cond, equals, T } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Button } from 'schemaUI';
import Modal from 'react-modal';

import { Container, ComingSoon, DesktopActions, desktopButtonStyles } from './view.styles';
import messages from './view.messages';
import { Source } from './source';
import { DataWranglingScripts } from './dataWranglingScripts';
import { Filters } from './filters';
import { DataWranglingResult } from '../../dataWranglingResult';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { TopHeader } from '../../../shared/components/topHeader';
import {
  DATA_WRANGLING_STEP,
  DATA_WRANGLING_RESULT_STEP,
  FIELDS_STEP,
  INITIAL_STEP,
  FILTERS_STEP,
  VIEWS_STEP,
  META_DATA_STEP,
} from '../../../modules/dataSource/dataSource.constants';
import { ModalActions, ModalButton, getModalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
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
  };

  state = {
    confirmationModalOpen: false,
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
      {
        label: intl.formatMessage(messages.removeDataSource),
        onClick: this.handleRemoveClick,
      },
    ];

    return {
      headerTitle,
      headerSubtitle: this.getHeaderSubtitle(activeStep),
      secondaryMenuItems,
    };
  };

  handleRemoveClick = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleConfirmRemove = () => {
    const {
      dataSource: { project: projectId, id: dataSourceId },
    } = this.props;

    this.props.removeDataSource({ projectId, dataSourceId });
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
    const { confirmationModalOpen } = this.state;
    const activeStep = parseInt(step, 10);
    const topHeaderConfig = this.getHeaderAndMenuConfig(activeStep);
    const isInitalStep = activeStep === INITIAL_STEP;

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        {this.renderContentForm({
          activeStep,
          intl,
          dataSource,
          ...this.props,
        })}
        <DesktopActions visibile={isInitalStep}>
          <Button id="removeDataSourceDesktopBtn" onClick={this.handleRemoveClick} customStyles={desktopButtonStyles}>
            {intl.formatMessage(messages.removeDataSource)}
          </Button>
        </DesktopActions>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={getModalStyles()}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <ModalButton onClick={this.handleCancelRemove}>
              <FormattedMessage {...messages.cancelRemoval} />
            </ModalButton>
            <ModalButton onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </ModalButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  });

  render() {
    return <Container>{this.renderContent(!!this.props.dataSource.id)}</Container>;
  }
}
