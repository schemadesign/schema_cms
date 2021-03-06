import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, findLast, isEmpty, path, pipe, propEq } from 'ramda';
import { Form, Typography, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import {
  Container,
  customRadioGroupStyles,
  Dot,
  JobItem,
  JobItemWrapper,
  ListWrapper,
  RadioLabel,
  JobInformation,
  EyeWrapper,
} from './jobList.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { BackLink, NavigationContainer, NextButton } from '../../../shared/components/navigation';

import messages from './jobList.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { JOB_OPTION, JOB_STATE_SUCCESS } from '../../../modules/job/job.constants';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../../project/project.constants';

const { RadioGroup, RadioStyled } = Form;
const { EyeIcon } = Icons;
const { Span } = Typography;

export class JobList extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    fetchJobList: PropTypes.func.isRequired,
    revertToJob: PropTypes.func.isRequired,
    jobList: PropTypes.array.isRequired,
    dataSource: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    error: null,
    selectedJob: null,
    loading: true,
    canRevert: false,
  };

  async componentDidMount() {
    try {
      await this.props.fetchJobList(path(['match', 'params'], this.props));
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getActiveJobId = () => path(['dataSource', 'activeJob', 'id'], this.props);

  getSelectedJob = () => this.state.selectedJob || this.getActiveJobId();

  isJobActive = id => id === this.getActiveJobId();

  handleChange = ({ target: { value: selectedJob } }) => {
    selectedJob = parseInt(selectedJob, 10);
    const { jobList } = this.props;
    const selectedJobSuccess = pipe(
      findLast(propEq('id', selectedJob)),
      propEq('jobState', JOB_STATE_SUCCESS)
    )(jobList);
    const canRevert = selectedJob !== this.getActiveJobId(this.props) && selectedJobSuccess;

    this.setState({ selectedJob, canRevert });
  };

  handleRevertClick = () =>
    this.props.revertToJob({
      dataSourceId: getMatchParam(this.props, 'dataSourceId'),
      jobId: this.state.selectedJob,
    });

  renderActiveInformation = isActive => renderWhenTrue(always(<FormattedMessage {...messages.active} />))(isActive);

  renderStepMessage = ({ steps }) =>
    renderWhenTrueOtherwise(
      always(<FormattedMessage {...messages.originalFile} />),
      always(<FormattedMessage values={{ length: steps.length }} {...messages.steps} />)
    )(isEmpty(steps));

  renderList = (job, index) => {
    const isActive = this.isJobActive(job.id);
    const selectedJob = this.getSelectedJob();
    const id = `${JOB_OPTION}-${index}`;

    return (
      <JobItemWrapper key={index}>
        <JobItem>
          <RadioStyled value={job.id} id={id} selectedValue={selectedJob} />
          <RadioLabel htmlFor={id}>
            <JobInformation>
              <Span>{extendedDayjs(job.created, BASE_DATE_FORMAT).format('DD/MM/YYYY HH:mm')}</Span>
            </JobInformation>
            <JobInformation>
              <Dot />
              <Span>
                <FormattedMessage {...messages[job.jobState]} />
              </Span>
            </JobInformation>
            <JobInformation>
              <Dot />
              <Span>
                {this.renderStepMessage(job)}
                {this.renderActiveInformation(isActive)}
              </Span>
            </JobInformation>
          </RadioLabel>
        </JobItem>
        <EyeWrapper to={`/job/${job.id}`}>
          <EyeIcon />
        </EyeWrapper>
      </JobItemWrapper>
    );
  };

  renderContent = ({ jobList, canRevert, isLoading, error }) => (
    <Fragment>
      <LoadingWrapper loading={isLoading} noData={isEmpty(jobList)} error={error}>
        <RadioGroup
          name={JOB_OPTION}
          onChange={this.handleChange}
          customStyles={customRadioGroupStyles}
          value={this.getSelectedJob()}
        >
          <ListWrapper>{jobList.map(this.renderList)}</ListWrapper>
        </RadioGroup>
      </LoadingWrapper>
      <NavigationContainer fixed>
        <BackLink id="cancelBtn" to={`/datasource/${getMatchParam(this.props, 'dataSourceId')}`} />
        <NextButton id="revertBtn" onClick={this.handleRevertClick} disabled={!canRevert}>
          <FormattedMessage {...messages.revert} />
        </NextButton>
      </NavigationContainer>
    </Fragment>
  );

  render() {
    const { error, loading, canRevert } = this.state;
    const { dataSource, jobList, userRole } = this.props;

    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const isLoading = loading || isEmpty(dataSource);
    const menuOptions = getProjectMenuOptions(dataSource.project.id);

    return (
      <Container>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />

        {this.renderContent({ jobList, canRevert, isLoading, error })}
      </Container>
    );
  }
}
