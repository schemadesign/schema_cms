import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, either, cond, findLast, path, pipe, propEq, T } from 'ramda';
import { Form, Typography } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import {
  Container,
  Dot,
  Eye,
  JobItem,
  JobItemWrapper,
  RadioLabel,
  ListWrapper,
  customRadioGroupStyles,
} from './jobList.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

import messages from './jobList.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { Loader } from '../../../shared/components/loader';
import { NoData } from '../../../shared/components/noData';
import { JOB_STATE_SUCCESS, JOB_OPTION } from '../../../modules/job/job.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';

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
      this.setState({
        loading: false,
      });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  handleChange = ({ target: { value: selectedJob } }) => {
    selectedJob = parseInt(selectedJob, 10);
    const { jobList, dataSource } = this.props;
    const selectedJobSuccess = pipe(
      findLast(propEq('id', selectedJob)),
      propEq('jobState', JOB_STATE_SUCCESS)
    )(jobList);
    const canRevert = selectedJob !== dataSource.activeJob && selectedJobSuccess;

    this.setState({ selectedJob, canRevert });
  };

  handleCancelClick = () =>
    this.props.history.push(`/datasource/${path(['match', 'params', 'dataSourceId'], this.props)}`);

  handleIconClick = jobId => this.props.history.push(`/job/${jobId}`);

  handleRevertClick = () =>
    this.props.revertToJob({
      dataSourceId: path(['match', 'params', 'dataSourceId'], this.props),
      jobId: this.state.selectedJob,
    });

  renderActiveInformation = isActive => renderWhenTrue(always(<FormattedMessage {...messages.active} />))(isActive);

  renderList = (job, index) => {
    const isActive = job.id === this.props.dataSource.activeJob;
    const id = `${JOB_OPTION}-${index}`;
    const selectedJob = this.state.selectedJob ? this.state.selectedJob : this.props.dataSource.activeJob;
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

  renderContent = cond([
    [either(propEq('loading', true), propEq('dataSource', {})), always(<Loader />)],
    [propEq('jobList', []), always(<NoData />)],
    [
      T,
      () => (
        <RadioGroup
          name={JOB_OPTION}
          onChange={this.handleChange}
          customStyles={customRadioGroupStyles}
          value={this.state.selectedJob ? this.state.selectedJob : this.props.dataSource.activeJob}
        >
          <ListWrapper>{this.props.jobList.map(this.renderList)}</ListWrapper>
        </RadioGroup>
      ),
    ],
  ]);

  render() {
    const { loading, canRevert } = this.state;
    const { dataSource, jobList } = this.props;
    const topHeaderConfig = {
      headerTitle: <FormattedMessage {...messages.title} />,
      headerSubtitle: <FormattedMessage {...messages.subTitle} />,
    };

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        {this.renderContent({ loading, dataSource, jobList })}
        <NavigationContainer>
          <BackButton id="cancelBtn" onClick={this.handleCancelClick}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton id="revertBtn" onClick={this.handleRevertClick} disabled={!canRevert}>
            <FormattedMessage {...messages.revert} />
          </NextButton>
        </NavigationContainer>
      </Container>
    );
  }
}
