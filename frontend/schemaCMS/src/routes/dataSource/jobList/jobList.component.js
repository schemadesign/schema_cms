import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, path, both, isEmpty, cond, equals } from 'ramda';
import { Typography, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { Container, JobItem, ListWrapper, Dot, JobItemWrapper, RadioInput } from './jobList.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

import messages from './jobList.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { Loader } from '../../../shared/components/loader';
import { NoData } from '../../../shared/components/noData';

const JOB_LIST_NAME = 'job_list';
const { Span } = Typography;

export class JobList extends PureComponent {
  static propTypes = {
    fetchJobList: PropTypes.func.isRequired,
    revertToJob: PropTypes.func.isRequired,
    jobList: PropTypes.array.isRequired,
    isAnyJobSuccessful: PropTypes.bool.isRequired,
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
  };

  async componentDidMount() {
    try {
      await this.props.fetchJobList(path(['match', 'params'], this.props));
      this.setState({
        loading: false,
      });
    } catch (e) {
      console.log(e);
      // this.props.history.push('/');
    }
  }

  handleChange = ({ target: { value } }) => this.setState({ selectedJob: value });

  handleCancelClick = () =>
    this.props.history.push(`/datasource/${path(['match', 'params', 'dataSourceId'], this.props)}`);

  handleIconClick = jobId => this.props.history.push(`/job/${jobId}`);

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

  renderContent = cond([
    [equals(true), always(<Loader />)],
    [both(equals(false), () => isEmpty(this.props.jobList)), always(<NoData />)],
    [
      both(equals(false), () => !isEmpty(this.props.jobList)),
      () => <ListWrapper>{this.props.jobList.map(this.renderList)}</ListWrapper>,
    ],
  ]);

  render() {
    const { isAnyJobSuccessful } = this.props;
    const { loading } = this.state;
    const topHeaderConfig = {
      headerTitle: <FormattedMessage {...messages.title} />,
      headerSubtitle: <FormattedMessage {...messages.subTitle} />,
    };

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        {this.renderContent(loading)}
        <NavigationContainer>
          <BackButton id="cancelBtn" onClick={this.handleCancelClick}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton id="revertBtn" onClick={this.handleRevertClick} disabled={!isAnyJobSuccessful}>
            <FormattedMessage {...messages.revert} />
          </NextButton>
        </NavigationContainer>
      </Container>
    );
  }
}
