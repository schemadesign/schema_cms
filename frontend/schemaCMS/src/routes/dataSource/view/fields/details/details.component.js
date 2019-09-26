import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defaultTo, innerJoin, isNil } from 'ramda';

import { renderWhenTrue } from '../../../../../shared/utils/rendering';
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

  renderEditIcon = renderWhenTrue(() => <EditIcon />);

  renderItem = (id, index) => {
    const value = this.props.data[id];
    const textValue = isNil(value) ? EMPTY : this.getTextValue(value);
    const isInformationField = INFORMATION_FIELDS.includes(id);
    const isEditable = EDITABLE_FIELDS.includes(id);
    const Item = isInformationField ? FieldInformation : FieldSummary;

    return (
      <Item key={index}>
        <Label>{this.props.intl.formatMessage(messages[id])}</Label>
        <Value>{textValue}</Value>
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
