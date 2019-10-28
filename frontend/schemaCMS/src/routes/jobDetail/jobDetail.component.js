import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path, always } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Button } from 'schemaUI';

import { Form, Value, FieldWrapper, Label } from './jobDetail.styles';
import browserHistory from '../../shared/utils/history';
import { renderWhenTrue } from '../../shared/utils/rendering';

import messages from './jobDetail.messages';
import { DESCRIPTION, JOB_ID, JOB_STATE } from '../../modules/job/job.constants';
import { TextInput } from '../../shared/components/form/inputs/textInput';

export class JobDetail extends PureComponent {
  static propTypes = {
    job: PropTypes.object.isRequired,
    fetchOne: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    values: PropTypes.object.isRequired,
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

  renderContent = job =>
    renderWhenTrue(
      always(
        <Form onSubmit={this.props.handleSubmit}>
          <FieldWrapper>
            <Label>
              <FormattedMessage {...messages[JOB_ID]} />
            </Label>
            <Value>{job.pk}</Value>
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
          <Button>
            <FormattedMessage {...messages.submit} />
          </Button>
        </Form>
      )
    )(!!job.pk);

  render() {
    return this.renderContent(this.props.job);
  }
}
