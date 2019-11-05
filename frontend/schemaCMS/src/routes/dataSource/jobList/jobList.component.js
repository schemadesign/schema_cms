import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { Typography, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { Container, JobItem, ListWrapper, Dot, JobItemWrapper, RadioInput } from './jobList.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import browserHistory from '../../../shared/utils/history';

import messages from './jobList.messages';

const JOB_LIST_NAME = 'job_list';
const { Span } = Typography;

export class JobList extends PureComponent {
  static propTypes = {
    fetchJobList: PropTypes.func.isRequired,
    revertToJob: PropTypes.func.isRequired,
    jobList: PropTypes.array.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    selectedJob: null,
  };

  componentDidMount() {
    this.props.fetchJobList(path(['match', 'params'], this.props));
  }

  handleChange = ({ target: { value } }) => this.setState({ selectedJob: value });

  handleCancelClick = () => browserHistory.push(`/datasource/${path(['match', 'params', 'dataSourceId'], this.props)}`);

  handleIconClick = jobId => browserHistory.push(`/job/${jobId}`);

  handleRevertClick = () => this.props.revertToJob({ jobId: this.state.selectedJob });

  renderList = (job, index) => (
    <JobItemWrapper key={index}>
      <JobItem>
        <RadioInput value={job.id} type="radio" name={JOB_LIST_NAME} onChange={this.handleChange} />
        <Span>{extendedDayjs(job.created, BASE_DATE_FORMAT).format('DD/MM/YYYY HH:mm')}</Span>
        <Dot />
        <Span>
          <FormattedMessage {...messages[job.jobState]} />
        </Span>
      </JobItem>
      <Icons.EyeIcon onClick={() => this.handleIconClick(job.id)} />
    </JobItemWrapper>
  );

  render() {
    const { jobList } = this.props;

    return (
      <Container>
        <ListWrapper>{jobList.map(this.renderList)}</ListWrapper>
        <NavigationContainer>
          <BackButton id="cancelBtn" onClick={this.handleCancelClick}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton id="revertBtn" onClick={this.handleRevertClick}>
            <FormattedMessage {...messages.revert} />
          </NextButton>
        </NavigationContainer>
      </Container>
    );
  }
}
