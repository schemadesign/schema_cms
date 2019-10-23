import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defaultTo, innerJoin, is, isNil } from 'ramda';

import { renderWhenTrue } from '../../utils/rendering';
import messages from './fieldDetail.messages';
import { EDITABLE_FIELDS, EMPTY, DEFAULT_STRUCTURE, INFORMATION_FIELDS } from './fieldDetail.constants';
import { Container, List, FieldInformation, FieldSummary, Label, Value, EditIcon } from './fieldDetail.styles';

export class FieldDetail extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getTextValue = defaultTo('');

  getRounded = (value) => `${Math.round(value * 100) / 100}`;

  getFormatted = (value) => is(Number, value) ? this.getRounded(value) : this.getTextValue(value);

  getValueTitle = (rawValue, updatedValue) => {
    const textValue = `${rawValue}`;

    return is(Number, rawValue) && textValue !== updatedValue ? textValue : null;
  }

  renderEditIcon = renderWhenTrue(() => <EditIcon />);

  renderItem = (id, index) => {
    const value = this.props.data[id];
    const textValue = isNil(value) ? EMPTY : this.getFormatted(value);
    const titleValue = this.getValueTitle(value, textValue);
    const isInformationField = INFORMATION_FIELDS.includes(id);
    const isEditable = EDITABLE_FIELDS.includes(id);
    const Item = isInformationField ? FieldInformation : FieldSummary;

    return (
      <Item key={index}>
        <Label>{this.props.intl.formatMessage(messages[id])}</Label>
        <Value title={titleValue}>{textValue}</Value>
        {this.renderEditIcon(isEditable)}
      </Item>
    );
  };

  render() {
    const labelsIds = innerJoin(
      (structureId, dataId) => structureId === dataId,
      DEFAULT_STRUCTURE,
      Object.keys(this.props.data)
    );

    return (
      <Container>
        <List>
          <FieldInformation>
            <Label>{this.props.intl.formatMessage(messages.field)}</Label>
            <Value>{this.props.id}</Value>
          </FieldInformation>
          {labelsIds.map(this.renderItem)}
        </List>
      </Container>
    );
  }
}
