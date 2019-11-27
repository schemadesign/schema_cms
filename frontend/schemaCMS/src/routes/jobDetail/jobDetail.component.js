import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Download, Form, LinkWrapper, PreviewLink, Step, StepsTitle, StepsWrapper } from './jobDetail.styles';
import browserHistory from '../../shared/utils/history';
import { renderWhenTrue } from '../../shared/utils/rendering';

import messages from './jobDetail.messages';
import { DESCRIPTION, JOB_ID, JOB_STATE, JOB_STATE_SUCCESS } from '../../modules/job/job.constants';
import { TextInput } from '../../shared/components/form/inputs/textInput';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { TopHeader } from '../../shared/components/topHeader';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';

export class JobDetail extends PureComponent {
  static propTypes = {
    job: PropTypes.object.isRequired,
    fetchOne: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const payload = path(['match', 'params'], this.props);
      await this.props.fetchOne(payload);
      this.setState({ loading: false });
    } catch (e) {
      browserHistory.push('/');
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleGoBack = () => this.props.history.push(`/datasource/${this.props.job.datasource}/job`);

  renderStep = ({ scriptName }, index) => <Step key={index}>{scriptName}</Step>;

  renderSteps = (steps = []) => steps.map(this.renderStep);

  renderSuccessLinks = isSuccess =>
    renderWhenTrue(
      always(
        <Fragment>
          <PreviewLink to={`/job/${this.props.job.id}/preview`}>
            <FormattedMessage {...messages.preview} />
          </PreviewLink>
          <Download href={this.props.job.result} download>
            <FormattedMessage {...messages.resultFile} />
          </Download>
        </Fragment>
      )
    )(isSuccess);

  renderForm = job => () => (
    <Fragment>
      <TextInput
        label={<FormattedMessage {...messages[JOB_ID]} />}
        value={job.id.toString()}
        name={JOB_ID}
        fullWidth
        disabled
      />
      <TextInput
        label={<FormattedMessage {...messages[JOB_STATE]} />}
        value={messages[job.jobState] ? this.props.intl.formatMessage(messages[job.jobState]) : ''}
        name={JOB_STATE}
        fullWidth
        disabled
      />
      <Form onSubmit={this.props.handleSubmit}>
        <TextInput
          label={<FormattedMessage {...messages.descriptionLabel} />}
          value={this.props.values[DESCRIPTION]}
          onChange={this.props.handleChange}
          name={DESCRIPTION}
          fullWidth
          isEdit
          {...this.props}
          multiline
        />
      </Form>
      <StepsTitle>
        <FormattedMessage {...messages.stepsTitle} />
      </StepsTitle>
      <StepsWrapper>{this.renderSteps(this.props.job.steps)}</StepsWrapper>
      <LinkWrapper>
        {this.renderSuccessLinks(job.jobState === JOB_STATE_SUCCESS)}
        <Download href={job.sourceFileUrl} download>
          <FormattedMessage {...messages.originalFile} />
        </Download>
      </LinkWrapper>
    </Fragment>
  );

  renderSaveButton = renderWhenTrue(() => (
    <NextButton
      onClick={this.props.handleSubmit}
      loading={this.props.isSubmitting}
      disabled={!this.props.dirty || !this.props.isValid || this.props.isSubmitting}
    >
      <FormattedMessage {...messages.save} />
    </NextButton>
  ));

  render() {
    const { loading } = this.state;
    const { job } = this.props;
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        <LoadingWrapper loading={loading}>{this.renderForm(job)}</LoadingWrapper>
        <NavigationContainer>
          <BackButton onClick={this.handleGoBack}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          {this.renderSaveButton(!!job.id)}
        </NavigationContainer>
      </Fragment>
    );
  }
}
