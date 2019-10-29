import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Form, Value, FieldWrapper, Label, Download, LinkWrapper, PreviewLink } from './jobDetail.styles';
import browserHistory from '../../shared/utils/history';
import { renderWhenTrue } from '../../shared/utils/rendering';

import messages from './jobDetail.messages';
import { DESCRIPTION, JOB_ID, JOB_STATE } from '../../modules/job/job.constants';
import { TextInput } from '../../shared/components/form/inputs/textInput';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { TopHeader } from '../../shared/components/topHeader';

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
  };

  async componentDidMount() {
    try {
      const payload = path(['match', 'params'], this.props);
      await this.props.fetchOne(payload);
    } catch (e) {
      browserHistory.push('/');
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleGoBack = () => this.props.history.push(`/project/${this.props.job.project}/datasource`);

  renderForm = job =>
    renderWhenTrue(() => (
      <Form onSubmit={this.props.handleSubmit}>
        <FieldWrapper>
          <Label>
            <FormattedMessage {...messages[JOB_ID]} />
          </Label>
          <Value>{job.id}</Value>
        </FieldWrapper>
        <FieldWrapper>
          <Label>
            <FormattedMessage {...messages[JOB_STATE]} />
          </Label>
          <Value>
            <FormattedMessage {...messages[job.jobState]} />
          </Value>
        </FieldWrapper>
        <FieldWrapper>
          <TextInput
            label={<FormattedMessage {...messages.descriptionLabel} />}
            value={this.props.values[DESCRIPTION]}
            onChange={this.props.handleChange}
            name={DESCRIPTION}
            fullWidth
            {...this.props}
            multiline
          />
        </FieldWrapper>

        <LinkWrapper>
          <PreviewLink to={`/job/${job.id}/preview`}>
            <FormattedMessage {...messages.preview} />
          </PreviewLink>
          <Download href={job.result} download>
            <FormattedMessage {...messages.resultFile} />
          </Download>
          <Download href={job.sourceFileUrl} download>
            <FormattedMessage {...messages.originalFile} />
          </Download>
        </LinkWrapper>
      </Form>
    ))(!!job.id);

  renderSaveButton = renderWhenTrue(() => (
    <NextButton onClick={this.props.handleSubmit} disabled={!this.props.dirty || !this.props.isValid}>
      <FormattedMessage {...messages.save} />
    </NextButton>
  ));

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        {this.renderForm(this.props.job)}
        <NavigationContainer>
          <BackButton onClick={this.handleGoBack}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          {this.renderSaveButton(!!this.props.job.id)}
        </NavigationContainer>
      </Fragment>
    );
  }
}
