import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, always, keys, map, pipe, path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container, NoFields, Field } from './list.styles';
import browserHistory from '../../../shared/utils/history';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';

import messages from './list.messages';

export class List extends PureComponent {
  static propTypes = {
    fetchFields: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
  };

  async componentDidMount() {
    try {
      await this.props.fetchFields(path(['match', 'params'], this.props));
    } catch (e) {
      browserHistory.push('/');
    }
  }

  renderField = field => <Field key={field}>{field}</Field>;

  renderDataSourceFields = fields =>
    renderWhenTrueOtherwise(
      always(
        <NoFields>
          <FormattedMessage {...messages.noFields} />
        </NoFields>
      ),
      () =>
        pipe(
          keys,
          map(this.renderField)
        )(fields)
    )(isEmpty(fields));

  render() {
    const { fields } = this.props;

    return <Container>{this.renderDataSourceFields(fields)}</Container>;
  }
}
