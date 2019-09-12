import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { add, always, equals, defaultTo, has, ifElse, isNil, uniq } from 'ramda';

import { renderWhenTrue } from '../../../../../../shared/utils/rendering';
import messages from './details.messages';
import { EDITABLE_FIELDS, EMPTY, DEFAULT_STRUCTURE, INFORMATION_FIELDS } from './details.constants';
import { Container, List, FieldInformation, FieldSummary, Label, Value, EditIcon } from './details.styles';

export class Details extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getTextValue = defaultTo('');

  getNextIndex = index => ifElse(equals(true), always(0), always(add(index, 1)));

  renderEditIcon = renderWhenTrue(() => <EditIcon />);

  renderItem = ([list, index], id) => {
    if (!has(id)(this.props.data)) {
      return [list, index];
    }

    const value = this.props.data[id];
    const textValue = isNil(value) ? EMPTY : this.getTextValue(value);
    const key = list.length;
    const isInformationField = INFORMATION_FIELDS.includes(id);
    const nextIndex = this.getNextIndex(index)(isInformationField);
    const isEditable = EDITABLE_FIELDS.includes(id);
    const message = messages[id];
    const label = message ? this.props.intl.formatMessage(message) : id;
    const Item = isInformationField ? FieldInformation : FieldSummary;

    list.push(
      <Item key={key} index={index}>
        <Label>{label}</Label>
        <Value>{textValue}</Value>
        {this.renderEditIcon(isEditable)}
      </Item>
    );

    return [list, nextIndex];
  };

  render() {
    const fieldIds = uniq([...DEFAULT_STRUCTURE, ...Object.keys(this.props.data)]);

    const [content] = fieldIds.reduce(this.renderItem, [[], 0]);

    return (
      <Container>
        <List>
          <FieldInformation>
            <Label>{this.props.intl.formatMessage(messages.field)}</Label>
            {this.props.id}
          </FieldInformation>
          {content}
        </List>
      </Container>
    );
  }
}
