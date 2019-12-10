import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, findLast, isEmpty, path, pipe, propEq } from 'ramda';
import { Form, Typography } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import {
  Container,
  customRadioGroupStyles,
  Dot,
  Eye,
  JobItem,
  JobItemWrapper,
  ListWrapper,
  RadioLabel,
} from './jobList.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

import messages from './jobList.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { JOB_OPTION, JOB_STATE_SUCCESS } from '../../../modules/job/job.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { getMatchParam } from '../../../shared/utils/helpers';

const { RadioGroup, RadioStyled } = Form;

const { Span } = Typography;

export class JobList extends PureComponent {
  static propTypes = {
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
    selectedJob: null,
    loading: true,
    canRevert: false,
  };

  async componentDidMount() {
    try {
      await this.props.fetchJobList(path(['match', 'params'], this.props));
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
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

  handleCancelClick = () => this.props.history.push(`/datasource/${getMatchParam(this.props, 'dataSourceId')}`);

  handleIconClick = jobId => this.props.history.push(`/job/${jobId}`);

  handleRevertClick = () =>
    this.props.revertToJob({
      dataSourceId: getMatchParam(this.props, 'dataSourceId'),
      jobId: this.state.selectedJob,
    });

  renderActiveInformation = isActive => renderWhenTrue(always(<FormattedMessage {...messages.active} />))(isActive);

  renderList = (job, index) => {
    const isActive = this.isJobActive(job.id);
    const selectedJob = this.getSelectedJob();
    const id = `${JOB_OPTION}-${index}`;

    return (
      <JobItemWrapper key={index}>
        <JobItem>
          <RadioStyled value={job.id} id={id} selectedValue={selectedJob} />
          <RadioLabel htmlFor={id}>
            <Span>{extendedDayjs(job.created, BASE_DATE_FORMAT).format('DD/MM/YYYY HH:mm')}</Span>
            <Dot />
            <Span>
              <FormattedMessage {...messages[job.jobState]} />
              {this.renderActiveInformation(isActive)}
            </Span>
          </RadioLabel>
        </JobItem>
        <Eye onClick={() => this.handleIconClick(job.id)} />
      </JobItemWrapper>
    );
  };

  renderContent = ({ jobList, canRevert, isLoading }) => (
    <Fragment>
      <LoadingWrapper loading={isLoading} noData={isEmpty(jobList)}>
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
        <BackButton id="cancelBtn" onClick={this.handleCancelClick}>
          <FormattedMessage {...messages.cancel} />
        </BackButton>
        <NextButton id="revertBtn" onClick={this.handleRevertClick} disabled={!canRevert}>
          <FormattedMessage {...messages.revert} />
        </NextButton>
      </NavigationContainer>
    </Fragment>
  );

  render() {
    const { loading, canRevert } = this.state;
    const { dataSource, jobList } = this.props;

    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const isLoading = loading || isEmpty(dataSource);

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />

        {this.renderContent({ jobList, canRevert, isLoading })}
      </Container>
    );
  }
}
